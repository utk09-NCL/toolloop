type Level = "INFO" | "WARN" | "ERROR" | "METRIC";
type Context = Record<string, unknown>;

function fmt(level: Level, message: string, context?: Context): string {
  const ts = new Date().toISOString();
  const ctx = context && Object.keys(context).length > 0 ? `  ${JSON.stringify(context)}` : "";
  return `[${level}] ${ts}  ${message}${ctx}`;
}

// Next.js redirect() and notFound() throw special errors with a 'digest' starting "NEXT_".
// Treat these as intentional exits, not failures.
function isNextInternalThrow(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as Record<string, unknown>).digest === "string" &&
    ((err as Record<string, unknown>).digest as string).startsWith("NEXT_")
  );
}

/** Logs an informational message with optional structured context. */
function info(message: string, context?: Context): void {
  console.log(fmt("INFO", message, context));
}

/** Logs a warning - use for expected-but-notable failures (domain denials, validation). */
function warn(message: string, context?: Context): void {
  console.warn(fmt("WARN", message, context));
}

/** Logs an error - use for unexpected failures outside normal business logic. */
function error(message: string, context?: Context): void {
  console.error(fmt("ERROR", message, context));
}

/** Times fn and logs its duration. Re-throws on real errors; treats Next.js redirect/notFound as success. */
async function metric<T>(name: string, fn: () => T | Promise<T>, context?: Context): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn();
    const ms = Date.now() - start;
    console.log(fmt("METRIC", `${name} completed in ${ms}ms`, context));
    return result;
  } catch (err) {
    const ms = Date.now() - start;
    if (isNextInternalThrow(err)) {
      console.log(fmt("METRIC", `${name} completed in ${ms}ms`, context));
      throw err;
    }
    const msg = err instanceof Error ? err.message : String(err);
    console.error(fmt("ERROR", `${name} failed after ${ms}ms - ${msg}`, context));
    throw err;
  }
}

export const logger = { info, warn, error, metric };
