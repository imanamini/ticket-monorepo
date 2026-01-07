import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { MessageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { PageLoadingComponent } from '../../../components/page-loading/page-loading.component';
import { UserIdentityViewModel } from '../../../data-access/models/digi-card-issuance-response.interface';
import { DigiCardIssuanceService } from '../../../data-access/services/digi-card-issuance.service';
import { PageLoadingService } from '../../../components/page-loading/page-loading.service';
import { DigiCardIssuanceStatus, DigiCardIssuanceStep } from '../../../data-access/models/digi-card-issuance.enum';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpStatusCode } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'digipay-card-applet-personal-info-review',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    PipesModule,
    NgxDividerComponent,
    DpIconComponent,
    NgxCalloutComponent,
    NgxButtonComponent,
    UiFormFieldBuilderModule,
    FormsModule,
    PageLoadingComponent,
    NgxAppBarComponent,
  ],
  providers: [PageLoadingService],
  templateUrl: './personal-info-review.component.html',
  styleUrl: './personal-info-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoReviewComponent {
  pageLoadingService = inject(PageLoadingService);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  router = inject(Router);
  backHandler = inject(BackHandlerService);
  private destroyRef = inject(DestroyRef);

  private messageService = inject(MessageService);
  issuanceService = inject(DigiCardIssuanceService);
  description = signal<string>('');
  addressDetail = computed<UserIdentityViewModel | null>(() => {
    const detail = this.issuanceService.addressDetail();

    if (!detail) {
      return null;
    }

    return {
      ...detail,
      birthDate: new Date(detail.birthDate),
    };
  });
  edit() {
    this.backHandler.setCustomBackUrl('/card/issuance/personal-info', true);
    this.backHandler.goBack();
  }
  approve() {
    this.pageLoadingService.showLoading();
    this.issuanceService
      .addressApprove(this.description())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .pipe(
        finalize(() => {
          this.pageLoadingService.hideLoading();
        }),
      )
      .subscribe({
        next: (res) => {
          this.pageLoadingService.hideLoading();
          this.router.navigate(['/card/issuance/result']);
        },
        error: (err) => {
          this.messageService.showErrorMessage(err?.error?.result?.message);
          if (err.status === HttpStatusCode.UnprocessableEntity && err.error.result.status === 18607) {
            this.router.navigateByUrl('/card/issuance');
          }
        },
      });
  }
  handleDescriptionChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.description.set(input.value);
  }
  goBack() {
    this.backHandler.setCustomBackUrl('/transactions', true);
    this.backHandler.goBack();
  }
}
