import { NextRequest, NextResponse } from "next/server";
import { inspect } from "node:util";
import fs from "node:fs";
import path from "node:path";
import { normalizeSearchParams } from "@/lib/core/url";
import { log } from "@/lib/core/log";
import { fetchOfficialFeatured } from "@/lib/services/pricing.server";

export const runtime = "nodejs"; // ensure Node runtime so fs/console work

function logJSON(label: string, obj: any) {
  // Pretty + no depth limit + full arrays
  log.price.debug(
    `${label}:\n` +
      inspect(obj, { depth: null, colors: true, maxArrayLength: null, breakLength: 120 })
  );
}

function maybeWriteFile(filenameBase: string, data: any) {
  try {
    // Only in dev or if you explicitly allow it
    if (process.env.PRICE_WRITE_FILES !== "1") return;
    const dir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const file = path.join(dir, `${filenameBase}-${ts}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
    log.price.debug(`wrote ${file}`);
  } catch (e) {
    log.price.warn("file write failed:", e);
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("property_token");
  const hotelName = req.nextUrl.searchParams.get("hotel_name");
  const debugFlag = req.nextUrl.searchParams.get("debug") === "1" || process.env.PRICE_DEBUG === "1";

  // Normalize search parameters
  const { checkIn, checkOut, adults, children, rooms } = normalizeSearchParams({ 
    searchParams: Object.fromEntries(req.nextUrl.searchParams) 
  });

  if (!token) return NextResponse.json({ error: "Missing property_token" }, { status: 400 });

  try {
    // Use shared service for upstream fetch
    const officialData = await fetchOfficialFeatured({
      token,
      checkIn,
      checkOut,
      adults,
      children,
      rooms
    });

    // ---- TERMINAL LOGGING (toggle via debug=1 or PRICE_DEBUG=1) ----
    if (debugFlag) {
      logJSON("Official featured data", officialData);
      // optional file dump (enable with PRICE_WRITE_FILES=1)
      maybeWriteFile(`price-${token}`, officialData);
    }

    // Return full response when debug is enabled
    if (debugFlag) {
      return NextResponse.json(officialData);
    }
    
    // Return minimal response
    if (officialData.nightlyFrom) {
      return NextResponse.json({
        currency: officialData.currency || "CAD",
        nightlyFrom: Number(officialData.nightlyFrom),
        ...(officialData.officialLink && { officialBookingUrl: officialData.officialLink }),
      });
    }
    
    return NextResponse.json({});

  } catch (error) {
    log.price.error('Error in price API:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
