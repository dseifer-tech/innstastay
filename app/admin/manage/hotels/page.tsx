"use client";
import { useState } from "react";

export default function ImportHotelsPage() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  async function runImport() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/admin/hotels/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceUrl: "/data/hotels.csv" }), // adjust as needed
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Import failed");
      setMsg(`Imported ${json.imported}, skipped ${json.skipped}`);
    } catch (e: unknown) {
      const err = e as Error;
      setMsg(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Import Hotels</h1>
      <p className="text-gray-600">Use this interface to bulk import hotels into the system.</p>
      <button
        className="rounded-xl px-4 py-2 shadow border bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        onClick={runImport}
        disabled={busy}
      >
        {busy ? "Importing…" : "Run Import"}
      </button>
      {msg && <p className="text-sm opacity-80 mt-2">{msg}</p>}
      
      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-medium mb-2">Import Methods</h2>
        <p className="text-sm text-gray-600">
          This interface supports importing hotels via:
        </p>
        <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
          <li>Source URL (CSV/JSON files)</li>
          <li>Direct JSON payload</li>
          <li>Individual hotel records (via existing admin-server interface)</li>
        </ul>
      </div>
    </main>
  );
}
