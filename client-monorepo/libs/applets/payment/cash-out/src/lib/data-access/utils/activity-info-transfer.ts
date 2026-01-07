import { ActivityInfo } from '@digipay/ngx-payment-result/lib/model/payment-result.model';

// ToDo: after fixing wallet api we have to remove this func and replace with ConvertToActivityInfoModel
export function transformData(input: Record<string, any>): ActivityInfo[] {
  return Object.keys(input).map((key) => {
    const obj = input[key];
    const fieldKey = Object.keys(obj)[0];
    const fieldValue = obj[fieldKey];
    return {
      key: fieldKey,
      value: fieldValue,
      copyable: false,
    };
  });
}

export function ConvertToActivityInfoModel(data: any): ActivityInfo[] {
  return Object.keys(data).map((key: string) => {
    const innerKey = Object.keys(data[key])[0];
    const { value, copyable } = data[key][innerKey];

    return {
      key: innerKey,
      value: value,
      copyable: copyable,
    };
  });
}
