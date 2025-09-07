/**
 * Execute a function on an array of items with a concurrency limit
 */
export async function mapWithLimit<T, R>(
  items: T[], 
  limit: number, 
  fn: (item: T, i: number) => Promise<R>
): Promise<R[]> {
  const out: R[] = new Array(items.length) as any;
  let i = 0;
  
  async function worker() {
    while (i < items.length) {
      const n = i++;
      try { 
        out[n] = await fn(items[n], n); 
      } catch (e) { 
        out[n] = out[n] ?? (undefined as any); 
      }
    }
  }
  
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}
