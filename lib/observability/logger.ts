interface LogContext {
  readonly route?: string;
  readonly requestId?: string | null;
  readonly durationMs?: number;
  readonly userId?: string;
  readonly [key: string]: unknown;
}

function safeContext(context: LogContext): LogContext {
  const { email: _email, token: _token, password: _password, ...safe } =
    context as LogContext & {
      email?: unknown;
      token?: unknown;
      password?: unknown;
    };
  return safe;
}

export function logInfo(message: string, context: LogContext = {}): void {
  console.log(
    JSON.stringify({
      level: "info",
      message,
      timestamp: new Date().toISOString(),
      ...safeContext(context),
    }),
  );
}

export function logError(
  message: string,
  error: unknown,
  context: LogContext = {},
): void {
  console.error(
    JSON.stringify({
      level: "error",
      message,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      ...safeContext(context),
    }),
  );
}
