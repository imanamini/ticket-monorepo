import { PagePathEnum } from "./page.enum";

export abstract class StepContract {
  abstract goTo(page:PagePathEnum): void;
  abstract back(): void;
  abstract exit():void
  protected nextDictionary: Partial<Record<PagePathEnum, PagePathEnum>> = {
    [PagePathEnum.CHOOSE_AMOUNT]: PagePathEnum.CHOOSE_CARD,
    [PagePathEnum.ADD_NEW_CARD]: PagePathEnum.CONFIRMATION,
    [PagePathEnum.WALLET_TRANSFER_CHOOSE_AMOUNT]: PagePathEnum.CHOOSE_CARD,
    [PagePathEnum.CHOOSE_CARD]: PagePathEnum.CONFIRMATION,
    [PagePathEnum.CONFIRMATION]: PagePathEnum.RECEIPT,
  };
}
