import {numberToString} from "../../../utils/number-to-string";

export function TomanConvertor(rialAmount: number): string {
  const tomanAmount: number = Number(rialAmount.toString().slice(0, -1));
  let result: string;
  if (rialAmount.toString().length < 5) {
    result = tomanAmount + 'تومان';
  } else {
    result = numberToString(tomanAmount) + 'تومان';
  }
  return result;
}
