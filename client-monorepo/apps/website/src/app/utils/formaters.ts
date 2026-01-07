export const stripSlash = (num) => {
  return num.toString().replace(/\//g, '');
};

export function bufferToHex(buffer: ArrayBuffer | ArrayBufferLike) {
  // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function fromHexString(hexString: string): Uint8Array {
  const match = hexString.match(/.{1,2}/g) || [];
  return Uint8Array.from(match.map((byte) => parseInt(byte, 16)));
}

export function convertPersianDigitsToEnglish(string: string | number) {
  // make sure it is String
  string = '' + string;
  const map = {
    '۰': '0',
    '۱': '1',
    '۲': '2',
    '۳': '3',
    '۴': '4',
    '۵': '5',
    '۶': '6',
    '۷': '7',
    '۸': '8',
    '۹': '9',
  };

  const numbers = string.split('');
  for (let i = 0; i < numbers.length; i++) {
    if (map.hasOwnProperty(numbers[i])) {
      numbers[i] = map[numbers[i]];
    }
  }

  return numbers.join('');
}
