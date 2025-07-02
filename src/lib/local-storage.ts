const isBrowser = typeof window !== 'undefined';

export function getStorage<T = string>(key: string): T | null {
  if (!isBrowser) return null;
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch {
    return null;
  }
}

export function setStorage<T = string>(key: string, value: T): void {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

export function clearStorage(): void {
  if (!isBrowser) return;
  localStorage.clear();
}
