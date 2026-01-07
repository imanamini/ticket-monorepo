export enum PurchaseTicketTypeEnum {
  WALLET = 0,
  IPG = 2,
  BNPL = 13
}

export const PURCHASE_TICKET_TYPE_TRANSLATOR = {
  [PurchaseTicketTypeEnum.WALLET]: 'کیف‌پول',
  [PurchaseTicketTypeEnum.IPG]: 'نقدی',
  [PurchaseTicketTypeEnum.BNPL]: 'اعتباری',
};
