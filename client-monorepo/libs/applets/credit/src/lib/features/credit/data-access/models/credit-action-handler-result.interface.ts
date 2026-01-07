export interface CreditActionHandlerResultInterface {
  result: boolean;
  handleType?: CreditHandleTypeEnum;
}
export enum CreditHandleTypeEnum {
  self = 0,
  newTab = 1,
  instance = 2,
}
