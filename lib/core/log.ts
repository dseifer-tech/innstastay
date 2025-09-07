/**
 * Namespaced logger for consistent logging across the application
 */
export function createLogger(namespace: string) {
  return {
    debug: (...args: any[]) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${namespace}]`, ...args);
      }
    },
    info: (...args: any[]) => {
      console.log(`[${namespace}]`, ...args);
    },
    warn: (...args: any[]) => {
      console.warn(`[${namespace}]`, ...args);
    },
    error: (...args: any[]) => {
      console.error(`[${namespace}]`, ...args);
    }
  };
}

// Pre-configured loggers for common namespaces
export const log = {
  price: createLogger('price-enrich'),
  hotel: createLogger('hotel-source'),
  image: createLogger('image-proxy'),
  official: createLogger('official-featured'),
  admin: createLogger('admin'),
  ui: createLogger('ui'),
  img: createLogger('img'),
  env: createLogger('env'),
};
