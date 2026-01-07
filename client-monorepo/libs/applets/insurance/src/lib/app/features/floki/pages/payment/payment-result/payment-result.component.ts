import { Component, inject, OnInit, signal } from '@angular/core';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApplicationFormService } from '../../../services/application-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsEnum } from '../../../enums/query-params.enum';
import { FlokiRoutesEnum } from '../../../enums/floki-routes.enum';
import { InsAlertComponent } from '../../../../../components/ins-alert/ins-alert.component';
import { BaseComponent } from '../../../../../components/base/base.component';
import { ReferrerService } from '../../../../../data-access/services/referrer.service';
import { IconEnum } from '../../../../../data-access/enums/icon.enum';
import { AlertColorEnum } from '../../../../../data-access/enums/alert-color.enum';
import { UiLoadingSpinnerComponent } from '../../../../../components/ui-loading-spinner/ui-loading-spinner.component';

@Component({
  selector: 'payment-result',
  standalone: true,
  imports: [UiLoadingSpinnerComponent, InsAlertComponent, NgxButtonComponent],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss',
})
export class PaymentResultComponent extends BaseComponent implements OnInit {
  private applicationFormService = inject(ApplicationFormService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private referrerService = inject(ReferrerService);
  protected readonly IconEnum = IconEnum;
  protected readonly AlertColorEnum = AlertColorEnum;

  isSuccessful = signal<boolean>(true);
  public isLoading = signal<boolean>(false);
  private applicationFormId: string;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.referrerService.setReferrerSource(this.route.snapshot.queryParamMap.get(QueryParamsEnum.Referrer));
    this.applicationFormId = this.route.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
    this.getPaymentResult();
  }

  private getPaymentResult(): void {
    this.isLoading.set(true);
    this.applicationFormService
      .checkPaymentResult(this.applicationFormId, this.route.snapshot.queryParamMap.get(QueryParamsEnum.PaymentId))
      .subscribe({
        next: (res) => {
          this.isSuccessful.set(res.result.isSuccess);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.isSuccessful.set(false);
          this.isLoading.set(false);
        },
      });
  }

  public onClick(): void {
    if (this.isSuccessful()) {
      this.router.navigate([FlokiRoutesEnum.Floki, FlokiRoutesEnum.CompleteInfo], {
        queryParams: {
          [QueryParamsEnum.ApplicationId]: this.applicationFormId,
        },
      });
    } else {
      this.router.navigate([FlokiRoutesEnum.Floki, FlokiRoutesEnum.PLP], {
        queryParams: {
          [QueryParamsEnum.ApplicationId]: this.applicationFormId,
        },
      });
    }
  }
}
