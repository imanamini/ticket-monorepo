import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BankEnum as BankTranslate,
  DirectDebitContract,
  DirectDebitContractColor,
  DirectDebitContractStatus,
  DirectDebitContractTranslate,
} from '../../data-access/model/direct-debit.model';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxIcon } from '@digipay/ngx-icon';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ContractManagementComponent } from '../contract-management/contract-management.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersianDatePipe } from '../../data-access/pipes/persian-date.pipe';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { CdkObserveContent } from '@angular/cdk/observers';
import { NoticeData } from '@digipay/ngx-notice';
import { Router } from '@angular/router';
import { DirectDebitApiService } from '../../data-access/services/direct-debit-api.service';
import { FormatedDate } from '../../data-access/pipes/formated-date.pipe';
import { finalize, tap } from 'rxjs';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';

@Component({
  selector: 'direct-debit-contract-list-card',
  templateUrl: './contract-list-card.component.html',
  styleUrl: './contract-list-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    NgxIcon,
    PersianDatePipe,
    NgxBadgeModule,
    NgxButtonComponent,
    CdkObserveContent,
    FormatedDate,
    NgxSkeletonLoadingComponent,
  ],
})
export class ContractListCardComponent {
  data = input<DirectDebitContract>();
  statusUpdated = output<void>();

  private readonly bottomSheet = inject<NgxBottomSheetService<any>>(NgxBottomSheetService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly message = inject(MessageService);
  private readonly api = inject(DirectDebitApiService);
  private readonly router = inject(Router);

  public readonly bankTranslate = BankTranslate;
  public readonly directDebitContractStatus = DirectDebitContractStatus;
  public readonly directDebitContractTranslate = DirectDebitContractTranslate;
  public readonly directDebitContractColor = DirectDebitContractColor;

  openManagementBottomSheet(data: DirectDebitContract) {
    const { contractId, status } = data;
    this.bottomSheet.openBottomSheet(ContractManagementComponent, {
      contractId,
      status,
    });
    this.handleBottomSheetOnboardingClose();
  }

  private handleBottomSheetOnboardingClose() {
    this.bottomSheet.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.statusUpdated.emit());
  }

  private confirmAndRun(config: NoticeData, onConfirm: () => ReturnType<DirectDebitApiService['activateContract']>) {
    onConfirm()
      .pipe(finalize(() => this.statusUpdated.emit()))
      .subscribe({
        error: (err) => this.message.showErrorOfErrorResponse(err),
      });
  }

  private cancelContract(redirectUrl: string) {
    if (this.data()?.status === DirectDebitContractStatus.REVOKED || this.data()?.status === DirectDebitContractStatus.EXPIRED) {
      this.router.navigate([redirectUrl]);
      return;
    }
    const contractId = this.data()?.contractId ?? '';

    return this.api.cancelContract({ contractId }).pipe(tap(() => this.router.navigate([redirectUrl])));
  }

  private activeContract(redirectUrl: string) {
    const contractId = this.data()?.contractId ?? '';

    return this.api.activateContract({ contractId }).pipe(
      tap(() => {
        this.message.showSuccessMessage('قرارداد پرداخت مستقیم شما با موفقیت فعال شد');
        this.router.navigate([redirectUrl]);
      }),
    );
  }

  onChangeActiveContract() {
    this.confirmAndRun(
      {
        state: 'info',
        title: 'فعال سازی مجدد ',
        description: `مجوز پرداخت مستقیم شما فعال خواهد شد.`,
        primaryButtonLabel: 'فعال سازی',
        primaryButtonStyle: 'fill',
        secondaryButtonLabel: 'انصراف',
        secondaryButtonStyle: 'tinted-on-elevated',
        isHorizontalAction: true,
        position: 'bottom-center',
      },
      () => this.activeContract('/direct-debit/list'),
    );
  }

  onChangeCreateNewContract() {
    this.confirmAndRun(
      {
        state: 'info',
        title: 'مجوز جدید',
        description: 'با ایجاد مجوز جدید، مجوز فعلی حذف خواهد شد.',
        primaryButtonLabel: 'مجوز جدید',
        primaryButtonStyle: 'fill',
        secondaryButtonLabel: 'انصراف',
        secondaryButtonStyle: 'tinted-on-elevated',
        isHorizontalAction: true,
        position: 'bottom-center',
      },
      () => this.cancelContract('/direct-debit/create'),
    );
  }
}
