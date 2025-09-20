// app/admin/hotels/import/route.ts
import { NextResponse } from "next/server";
import { importHotels, type ImportPayload } from "@/lib/hotels/import";
import { sanitizeError } from "@/lib/security";
import { log } from "@/lib/core/log";

export const runtime = "nodejs";

async function ensureAdmin() {
  // TODO: plug real auth/ratelimit here (e.g., verify session/role or ADMIN_SECRET)
  return;
}

const MAX_BODY_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(req: Request) {
  try {
    await ensureAdmin();

    // Body size guard
    const contentLength = req.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = (await req.json()) as Partial<ImportPayload> | undefined;
    if (!body) {
      return NextResponse.json({ error: "Missing JSON body" }, { status: 400 });
    }

    const result = await importHotels({
      sourceUrl: body.sourceUrl,
      rows: body.rows,
      hotel: body.hotel, // Support existing single hotel import
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    // Security: Log error but don't expose details to client
    log.admin.error('Error importing hotel:', err);
    
    const message = err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ 
      error: sanitizeError({ message }) 
    }, { status: 400 });
  }
}
