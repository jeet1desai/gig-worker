import superjson from 'superjson';

type SuperjsonSafe<T> = T extends bigint
  ? string
  : T extends Date
    ? string
    : T extends (infer U)[]
      ? SuperjsonSafe<U>[]
      : T extends object
        ? { [K in keyof T]: SuperjsonSafe<T[K]> }
        : T;

export const safeJson = <T>(data: T) => {
  const { json } = superjson.serialize(data);
  return json as SuperjsonSafe<T>;
};
