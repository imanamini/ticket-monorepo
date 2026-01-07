import { Component, inject, OnInit, signal } from '@angular/core';
import { PaymentHandlerService } from '../../services/payment-handler.service';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { forkJoin, of, switchMap } from 'rxjs';
import { ContractGeneratorService } from '../../services/contract-generator.service';
import { ICustomerAgreement } from '../../../../components/core/models/customer-agreement.interface';
import { FundDataService } from '../../../../components/core/services/fund-data.service';

import { INVESTMENT_LIST_ROUTE, PROSPECTUS_ROUTE, PURCHASE_ROUTE } from '../../../../data-access/constants/app-routes';
import { EIntrackEventName } from '../../../../components/core/models/intrack-event-name.enum';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { MessageService, RouteStateService } from '@client-monorepo/common/utilities';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { NgClass } from '@angular/common';
import { ISignAgreement } from '../../models/sign-agreement.interface';
import { IPDFSource } from '../../models/pdf-source.interface';

@Component({
  selector: 'app-sign-agreement',
  standalone: true,
  imports: [FormsModule, NgxButtonComponent, NgxIcon, NgxAppBarComponent, SpinnerComponent, NgxCheckboxComponent, NgClass],
  templateUrl: './sign-agreements.component.html',
  styleUrl: './sign-agreements.component.scss',
})
export class SignAgreementsComponent implements OnInit {
  checked = signal<boolean>(false);
  loading = signal<boolean>(false);
  isUploading = signal<boolean>(false);
  agreements = signal<ICustomerAgreement[]>([]);
  pdfSrc = signal<IPDFSource | undefined>(undefined);
  state = signal<ISignAgreement | undefined>(undefined);

  private routeState = inject(RouteStateService);
  private fundDataService = inject(FundDataService);
  private eventService = inject(NgxEventTrackerService);
  private messageService = inject(MessageService);
  private navigationService = inject(WealthNavigationService);
  private paymentHandlerService = inject(PaymentHandlerService);
  private contractGeneratorService = inject(ContractGeneratorService);

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    if (this.state().symbol) {
      this.fundDataService.verifyCustomer(this.state().symbol).subscribe((res) => {
        if (res?.success) {
          this.agreements.set(res.result.agreements);
          this.getPdfs();
        } else {
          this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
            queryParams: {
              type: 'FixedIncome',
            },
          });
        }
      });
    } else {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
        queryParams: {
          type: 'FixedIncome',
        },
      });
    }
  }

  async getPdfs() {
    this.pdfSrc.set(await this.contractGeneratorService.getContracts(this.state().symbol));
    this.loading.set(false);
  }

  onBackHandler() {
    if (this.state().symbol) {
      this.navigationService.navigate([PURCHASE_ROUTE, this.state().symbol], {
        state: this.state(),
      });
    } else {
      this.navigationService.navigate([INVESTMENT_LIST_ROUTE], {
        queryParams: {
          type: this.state().type,
        },
      });
    }
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async agreement() {
    this.isUploading.set(true);
    if (!this.pdfSrc()) {
      console.error('PDF sources are not available.');
      this.isUploading.set(false);
      this.messageService.showErrorMessage('PDF sources are not available.');
      this.onBackHandler();
      return;
    }
    const creditBase64 = await this.convertBlobToBase64(this.pdfSrc().creditContract);
    const customerAndBrokerBase64 = await this.convertBlobToBase64(this.pdfSrc().customerAndBrokerContract);
    const buyAndSellBase64 = await this.convertBlobToBase64(this.pdfSrc().buyAndSellContract);
    const riskStatementBase64 = await this.convertBlobToBase64(this.pdfSrc().iMEUnderWritingRiskStatementContract);
    const combinedBase64 = await this.convertBlobToBase64(this.pdfSrc().combinedContract);
    const payload = {
      Credit: creditBase64,
      CustomerAndBroker: customerAndBrokerBase64,
      BuyAndSell: buyAndSellBase64,
      IMEUnderWritingRiskStatement: riskStatementBase64,
    };
    const requests = [];
    for (const key in payload) {
      if (Object.prototype.hasOwnProperty.call(payload, key)) {
        requests.push(
          this.fundDataService.agreementCustomer(this.state().symbol, {
            items: [{ key, base64: payload[key] }],
            requestPerAgreement: true,
            lastAgreement: false,
          }),
        );
      }
    }

    forkJoin(requests).subscribe({
      next: (res) => {
        const isSuccessful = res.filter((req) => req.success === true);
        if (isSuccessful.length === res.length) {
          this.fundDataService
            .agreementCustomer(this.state().symbol, {
              items: [{ key: 'Combined', base64: combinedBase64 }],
              requestPerAgreement: true,
              lastAgreement: true,
            })
            .pipe(
              switchMap((sign) => {
                const eventData = {
                  eventName: EIntrackEventName.AGRREMENT_DONE,
                  eventData: {
                    State: sign.result.state,
                  },
                };
                this.eventService.sendEvent(eventData);
                if (sign.success) {
                  return this.fundDataService.verifyCustomer(this.state().symbol);
                }

                return of(null);
              }),
            )
            .subscribe(async (res) => {
              if (res?.success) {
                await this.paymentHandlerService.handleState(res.result.state, this.state());
              }
              this.isUploading.set(false);
            });
        }
      },
      error: (err) => {
        console.error('Contracts not sent', err);
      },
    });
  }

  displayAggrenet(agreement: ICustomerAgreement) {
    const convertToCamelCase = (input: string): string => (input.length === 0 ? '' : input.charAt(0).toLowerCase() + input.slice(1));
    const contractCamelCaseName = convertToCamelCase(agreement.key);
    this.navigationService.navigate([PROSPECTUS_ROUTE], {
      state: {
        pdfFile: this.pdfSrc()[contractCamelCaseName + 'Contract'],
        symbol: this.state().symbol,
        type: 'purchase',
        agreement: agreement.key,
        agreementTitle: agreement.description,
      },
    });
  }

  onToggleAgreement(event: any) {
    this.checked.set(event);
  }
}
