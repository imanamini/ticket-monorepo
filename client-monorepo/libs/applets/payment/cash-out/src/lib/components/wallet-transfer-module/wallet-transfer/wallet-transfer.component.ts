import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CellNumberValidation } from '../../../data-access/utils/cell-number-validation';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { MessageService } from '@client-monorepo/common/utilities';
import { WalletApiClient } from '../../../data-access/services/wallet-api-client.service';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { RecommendationListComponent } from '../recommendation-list/recommendation-list.component';
import { NgIf } from '@angular/common';
import { Recommendation } from '../../../data-access/models/recommendation.model';
import { WALLET_GTM_TAG, WalletGtmService } from '@client-monorepo/payment/wallet';

@Component({
  selector: 'cash-out-applet-wallet-transfer',
  templateUrl: './wallet-transfer.component.html',
  styleUrls: ['./wallet-transfer.component.scss'],
  standalone: true,
  imports: [UiFormFieldBuilderModule, FormsModule, ReactiveFormsModule, NgxButtonComponent, RecommendationListComponent, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletTransferComponent implements OnInit {
  walletForm: UntypedFormGroup;

  isSubmitting!: boolean;

  gettingRecommendations = true;

  recommendations = signal<Recommendation[]>([]);

  numberValidationRules = [Validators.required, CellNumberValidation];

  private changeDetectorRef = inject(ChangeDetectorRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: UntypedFormBuilder,
    private apiService: ApiService,
    private messageService: MessageService,
    private walletApiClient: WalletApiClient,
    private gtmWallet: WalletGtmService,
  ) {
    this.walletForm = this.fb.group({
      cellNumber: ['', this.numberValidationRules],
    });

    // this.navigationService.setActiveMenu('SERVICE_WALLET_TRANSFER__HOME');
  }

  ngOnInit(): void {
    // const data = this.routeStateService.getAll();

    // let cellNumber = data['cellNumber'];
    // if (cellNumber) {
    //   this.walletForm.controls['cellNumber'].setValue(cellNumber);
    //   if (!data.hasOwnProperty('autoSubmit') || data['autoSubmit'] !== false) {
    //     // default is true
    //     this.onSubmit();
    //   }
    // }

    this.getRecommendations();
    this.sendCashOutTransferEvent();
  }

  private sendCashOutTransferEvent() {
    this.gtmWallet.publishEvent(WALLET_GTM_TAG.CASHOUT_TRANSFER);
  }

  /**
   * Gets the recommendations from the API
   */
  private getRecommendations() {
    const request = new RequestBuilder(RequestTypeEnum.GET, 'recommendations/13');
    this.apiService.call(request).subscribe(
      (response: any) => {
        this.gettingRecommendations = false;
        this.recommendations.set(response.recommendations);
        this.changeDetectorRef.detectChanges();
      },
      (e) => {
        this.gettingRecommendations = false;
        this.messageService.showErrorOfErrorResponse(e);
      },
    );
  }

  /**
   * Click handler of the recommendation items
   * @param item
   */
  recommendationClick(item: Recommendation) {
    this.gtmWallet.publishEvent(WALLET_GTM_TAG.CASHOUT_TRANSFER_ADD_FRIENDS);

    if (item) {
      this.goToNextPage(item.id);
    }
  }

  /**
   * Submit
   */
  onSubmit(): void {
    this.gtmWallet.publishEvent(WALLET_GTM_TAG.CASHOUT_TRANSFER_ADD_PHONE);

    const cellNumber = this.walletForm.controls['cellNumber'].value;
    this.goToNextPage(cellNumber);
  }

  goToNextPage(cellNumber: string) {
    this.isSubmitting = true;

    this.walletApiClient.getUserDetail(cellNumber).subscribe(
      (result) => {
        sessionStorage.setItem('USER_DETAIL', JSON.stringify(result.userDetail));
        this.router.navigateByUrl('/cash-out/wallet-amount', {
          state: {
            userDetail: result.userDetail,
          },
        });
      },
      (e) => {
        this.isSubmitting = false;
        this.messageService.showErrorOfErrorResponse(e);
      },
    );
  }
}
