export interface ActionHandlerResultInterface {
  result: boolean;
  handleType?: HandleTypeEnum;
}
export enum HandleTypeEnum {
  self = 0,
  newTab = 1,
  instance = 2,
}
