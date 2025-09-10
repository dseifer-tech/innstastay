export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-6 w-64 rounded bg-gray-200 animate-pulse mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 p-4 shadow-sm">
            <div className="h-40 w-full rounded-xl bg-gray-200 animate-pulse" />
            <div className="mt-4 h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
            <div className="mt-4 h-9 w-32 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
