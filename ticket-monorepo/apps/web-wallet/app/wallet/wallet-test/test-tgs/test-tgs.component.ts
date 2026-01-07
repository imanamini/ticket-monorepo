import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from '../../../core/services/message.service';
import {TgsGetTicketBody} from '../../../api/models/tgs-get-ticket-body';
import {TicketType} from '../../../api/emuns/ticket-type.emun';
import {NewUpgService} from "../../../api/services/new-upg/new-upg.service";
import {finalize, switchMap} from "rxjs";
import {WalletBalanceResponse} from "../../../api/models/wallet-balance.response";

enum TestTypeEnum {
  CUSTOM = 'CUSTOM',
  NORMAL = 'NORMAL',
  CREDIT = 'CREDIT',
  WALLET = 'WALLET',
  ICP = 'ICP',
  CASH_IN_AND_PAY = 'CASH_IN_AND_PAY',
  DEFER_DEMOUNT_CASH_IN = 'DEFER_DEMOUNT_CASH_IN'
}

@Component({
  selector: 'app-test-tgs',
  templateUrl: './test-tgs.component.html',
  styleUrls: ['./test-tgs.component.scss']
})
export class TestTgsComponent implements OnInit {
  @Input()
  accessToken: string;


  public TestType = TestTypeEnum.NORMAL;

  cellNumber = '09';

  amount = 1000;

  customTicket = '';

  providerId: string;


  gettingToken = false;
  balance: number;
  amountErrorMessage: string;
  protected readonly TestTypeEnum = TestTypeEnum;
  private errorsDictionary: Record<string, string> = {
    ICP: 'برای تست این فیچر لطفا مبلغ را بیشتر از موجودی کیف پول انتخاب کنید.'
  }

  constructor(
    private newUpgService: NewUpgService,
    private router: Router,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.getAmount();
  }

  public updateCashInAndPayCellNumber(event: TestTypeEnum) {
    if (event !== TestTypeEnum.CASH_IN_AND_PAY) {
      return;
    }
    this.cellNumber = '09';
  }

  public test(): void {
    switch (this.TestType) {
      case TestTypeEnum.CASH_IN_AND_PAY:
        this.getSingleCahInAndPayTicket();
        break;
      case TestTypeEnum.ICP:
        this.getSingleICPTicket();
        break;
      case TestTypeEnum.CREDIT:
        this.getCreditTicket();
        break;
      case TestTypeEnum.CUSTOM:
        this.getCustomTicket();
        break;
      case TestTypeEnum.NORMAL:
        this.getNormalTicket();
        break;
      case TestTypeEnum.WALLET:
        this.getSingleWalletTicket();
        break;
      case TestTypeEnum.DEFER_DEMOUNT_CASH_IN:
        this.getDeferDemountCashIn();
        break;
    }
  }

  getCustomTicket() {
    this.gettingToken = true;
    if (this.customTicket) {
      this.gettingToken = false;
      this.router.navigateByUrl('/tgs/' + this.customTicket);
      return;
    }
  }

  public getNormalTicket(): void {
    this.generateProvideId();
    this.newUpgService.getTgsTicket(this.tgsTicketApiBody())
      .pipe(finalize(() => this.gettingToken = false))
      .subscribe(
        response => {
          this.router.navigateByUrl('/tgs/' + response.ticket);
        },
        e => {
          this.handleError(e);
        });
  }

  public getCreditTicket(): void {
    this.generateProvideId();
    const body: TgsGetTicketBody = Object.assign({
      additionalInfo: {
        basketDetailsDto: {
          items: [
            {
              supplierId: "supplier-id",
              productCode: "product-code",
              brand: "brand",
              productType: 1,
              count: 1,
              categoryId: "category-id"
            },
            {
              sellerId: "seller-id",
              supplierId: "supplier-id",
              productCode: "product-code",
              brand: "brand",
              productType: 2,
              count: 1,
              categoryId: "category-id"
            }
          ],
          basketId: "basket-id"
        }
      },
    }, this.tgsTicketApiBody());
    this.newUpgService.getTgsTicket(body)
      .pipe(finalize(() => this.gettingToken = false))
      .subscribe(
        response => {
          this.router.navigateByUrl('/tgs/' + response.ticket);
        },
        e => {
          this.handleError(e);
        });
  }

  public getSingleWalletTicket(): void {
    const singleWalletAdditionalInfo = {
      "additionalInfo": {
        "preferredGateway": "0",
      }
    }
    this.generateProvideId();
    this.getTicket(singleWalletAdditionalInfo);
  }

  public getSingleICPTicket(): void {
    if (!this.balance) {
      this.messageService.showErrorMessage('لطفا تا دریافت موجودی کیف پول کمی صبر کنید.')
      return;
    }
    if (this.amount < Number(this.balance)) {
      this.amountErrorMessage = this.errorsDictionary['ICP'];
      return;
    }
    this.getSingleWalletTicket();
  }

  public getSingleCahInAndPayTicket(): void {
    const singleCashInAndPayBody = {
      "additionalInfo": {
        "preferredGateway": "0",
      }
    }
    this.generateProvideId();
    this.getTicket(singleCashInAndPayBody);
  }

  private tgsTicketApiBody(): TgsGetTicketBody {
    return {
      type: TicketType.UPG,
      cellNumber: this.cellNumber,
      amount: this.amount,
      providerId: this.providerId,
      callbackUrl: window.location.origin,
    };
  }

  private getTicket(extraBody: any): void {
    this.newUpgService.getTgsTicket({
      ...this.tgsTicketApiBody(),
      ...(extraBody && {...extraBody})
    }).pipe(finalize(() => this.gettingToken = false))
      .subscribe(
        response => {
          this.router.navigateByUrl('/tgs/' + response.ticket);
        },
        e => {
          this.handleError(e);
        });
  }

  private generateProvideId(): void {
    this.providerId = Math.random().toString(32).substr(2) + Math.random().toString(32).substr(2);
  }

  private handleError(e): void {
    if (e.error && e.error.result) {
      this.messageService.showErrorIfExists(e);
    } else {
      this.messageService.showErrorMessage('بروز خطا. لطفا مجددا تلاش کنید');
    }
  }

  private getAmount(): void {
    this.generateProvideId();
    this.newUpgService.getTgsTicket(this.tgsTicketApiBody())
      .pipe(
        switchMap(response =>
          this.newUpgService.getUpgWalletBalance(response.ticket)
        ),
        finalize(() => this.gettingToken = false)
      )
      .subscribe(
        (result: WalletBalanceResponse) => {
          this.balance = result.amount;
        },
        error => {
          this.handleError(error);
        }
      );
  }

  private getDeferDemountCashIn():void{
    this.generateProvideId();
    const body ={
      type: TicketType.CASH_IN,
      cellNumber: this.cellNumber,
      providerId: this.providerId,
      callbackUrl: window.location.origin,
    }
    this.newUpgService.getTgsTicket(body)
      .pipe(finalize(() => this.gettingToken = false))
      .subscribe(
        response => {
          this.router.navigateByUrl('/tgs/' + response.ticket);
        },
        e => {
          this.handleError(e);
        });
  }

}
