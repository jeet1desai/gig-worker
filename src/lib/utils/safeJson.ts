import { Decimal } from '@prisma/client/runtime/library';

type Primitive = string | number | boolean | null;

export type JsonSafe<T> = T extends Decimal
  ? number
  : T extends bigint
    ? string
    : T extends Date
      ? string
      : T extends undefined
        ? never
        : T extends Primitive
          ? T
          : T extends Array<infer U>
            ? JsonSafe<U>[]
            : T extends object
              ? { [K in keyof T]: JsonSafe<T[K]> }
              : never;

export function safeJson<T>(input: T): JsonSafe<T> {
  if (input === null || input === undefined) {
    return null as JsonSafe<T>;
  }

  if (typeof input === 'object' && input !== null && 'toNumber' in input && typeof (input as any).toNumber === 'function') {
    return (input as any).toNumber() as JsonSafe<T>;
  }

  if (input instanceof Date) {
    return input.toISOString() as JsonSafe<T>;
  }

  if (typeof input === 'bigint') {
    return input.toString() as JsonSafe<T>;
  }

  if (Array.isArray(input)) {
    return input.map((item) => safeJson(item)) as JsonSafe<T>;
  }

  if (typeof input === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (typeof value !== 'function' && value !== undefined) {
        result[key] = safeJson(value);
      }
    }
    return result as JsonSafe<T>;
  }

  return input as JsonSafe<T>;
}
