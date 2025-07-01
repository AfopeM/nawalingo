const isDev = process.env.NODE_ENV === "development";

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev) console.log(...(args as Parameters<typeof console.log>));
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...(args as Parameters<typeof console.log>));
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...(args as Parameters<typeof console.log>));
  },
};
