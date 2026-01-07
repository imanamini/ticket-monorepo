import {Component, Inject, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Amount } from './amount';
import { CashOutProcessService } from '../../services/cash-out-process.service';
import { PATH } from '../../consts/cash-out-paths.const';
import { numberToString } from '../../utiles/number-to-string';
import { SeparateThousandsPipe } from '@digipay/ng-lib-pipes';
import {MessageService} from "../../../../core/services/message.service";
import {CashOutConfigModel} from "../../models/cash-out.model";
import {TICKET_TOKEN} from "../../utiles/ticket-token";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'choose-amount',
  templateUrl: './choose-amount.component.html',
  styleUrls: ['./choose-amount.component.scss'],
  providers: [SeparateThousandsPipe]
})
export class ChooseAmountComponent extends Amount implements OnInit {
  public message: string = '';
  public isInvalidAmount = false;
  public selectedAmount: string;
  public cashOutProcessService = inject(CashOutProcessService);
  private messageService = inject(MessageService);
  public isLoading = false;
  public router = inject(Router);
  public loading = true;
  public errorGetConfig: string = null;
  public config: CashOutConfigModel;
  public amountInWords: string;

  constructor(@Inject(TICKET_TOKEN) private ticket: BehaviorSubject<string>,
              private activatedRoute:ActivatedRoute) {
    super();
  }


  ngOnInit() {
    this.getConfig();
  }

  public next(state: 'TOTAL' | 'CUSTOM'): void {
    let selectedAmount: number = this.detectSelectedAmount(state);

    if(selectedAmount > this.config.cashoutableBalance){
      this.messageService.showErrorMessage('مبلغ مورد نظر بیشتر از موجودی قابل برداشت است.')
      return;
    }

    if(selectedAmount > this.config.remainingCap){
      this.messageService.showErrorMessage('مبلغ مورد نظر از حداکثر مبلغ قابل برداشت روزانه شما بیشتر است.')
      return;
    }

    this.amountErrorMessage(
      selectedAmount.toString(),
      this.config.maxAmount,
      this.config.minAmount,
      this.config.remainingCap)
      .then((errorMessage: string) => {
        this.messageService.showErrorMessage(errorMessage);
      })
      .catch(() => {
        this.cashOutProcessService.setSelectedUserAmount(selectedAmount);
        this.navigateToNextStep();
      });
  }

  private detectSelectedAmount(state: 'TOTAL' | 'CUSTOM'): number {
    switch (state) {
      case 'CUSTOM':
        return this.convertStringAmountToNumber(this.selectedAmount);
      case 'TOTAL':
        return this.config.cashoutableBalance;
    }
  }

  private getConfig(): void {
    this.setDefaultSelectedAmount();
    this.cashOutProcessService.getConfig()
      .then((config: CashOutConfigModel) => {
        this.config = config;
        this.loading = false;
        this.errorGetConfig = null;
      }).catch(() => {
      this.message = '';
      this.isInvalidAmount = false;
    });
  }

  private navigateToNextStep(): void {
    this.router.navigate(['../'+ PATH.chooseCard], { relativeTo: this.activatedRoute });
  }

  private setDefaultSelectedAmount() {
    const amount: number | string = this.cashOutProcessService.getSelectedUserAmount() || '';
    this.selectedAmount = amount.toString();
  }
}
