export function BinaryConvertor(number: string): string {
  const bigNumber = BigInt(number);
  return bigNumber.toString(2);
}
