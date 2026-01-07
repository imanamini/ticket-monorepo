export const stripSlash = (num: number) => {
  return num.toString().replace(/[^\d]/g, '');
};

export function bufferToHex(buffer: ArrayBuffer | ArrayBufferLike) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function fromHexString(hexString: string): Uint8Array {
  const match = hexString.match(/.{1,2}/g) || [];
  return Uint8Array.from(match.map((byte) => parseInt(byte, 16)));
}
