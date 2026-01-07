import {inject, Injectable} from '@angular/core';
import {PageEnum} from "../../enums/page.enum";
import {PageManagementService} from "../../services/page-management.service";
import {ScreenService} from "../../../../core/services/screen.service";

@Injectable()
export class CashInBackService {
  private pageManagementService = inject(PageManagementService);
  private screenService = inject(ScreenService);

  public backBasedOnScreen(page: PageEnum, isValidAmount: boolean): void {
    switch (this.screenService.device()) {
      case 'DESKTOP':
        this.backOnDesktop(page, isValidAmount);
        break
      case 'MOBILE':
        this.backOnMobile();
        break
      default:
        break
    }
  }

  private backOnDesktop(page: PageEnum, isValidAmount: boolean): void {
    switch (page) {
      case PageEnum.CPOTP:
      case PageEnum.CPPIN:
        if (isValidAmount) {
          this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
        } else {
          this.pageManagementService.implement(PageEnum.ICP_INVALID_AMOUNT);
        }
        break;

      case PageEnum.ICP_INVALID_AMOUNT:
      case PageEnum.ICP_VALID_AMOUNT:
        this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
        break;
    }
  }

  private backOnMobile(): void {
    this.pageManagementService.implement(PageEnum.PAYMENT_METHOD);
  }
}
