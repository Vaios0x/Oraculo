export async function sha256Bytes(message: string | Uint8Array): Promise<Uint8Array> {
  const data = typeof message === 'string' ? new TextEncoder().encode(message) : message;
  const digest = await crypto.subtle.digest('SHA-256', data as BufferSource);
  return new Uint8Array(digest);
}

export function randomBytes(len: number): Uint8Array {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return buf;
}


