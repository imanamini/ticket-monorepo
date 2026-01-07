 async function encryptData(data: string, publicKeyPem: string): Promise<string> {
  const key = await importRsaOaepSha1PublicKey(publicKeyPem);

  const encoded = new TextEncoder().encode(data); // UTF-8
  const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, key, encoded);

  return arrayBufferToBase64(encrypted);
}

async function importRsaOaepSha1PublicKey(publicKeyPem: string): Promise<CryptoKey> {
  const spkiDer = pemToArrayBuffer(publicKeyPem);

  return crypto.subtle.importKey(
    'spki',
    spkiDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-1', // ✅ matches Java OAEPWithSHA-1AndMGF1Padding
    },
    false,
    ['encrypt'],
  );
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s+/g, '');

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}