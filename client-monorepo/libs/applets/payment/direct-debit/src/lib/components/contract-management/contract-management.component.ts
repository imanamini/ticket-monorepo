import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { DirectDebitApiService } from '../../data-access/services/direct-debit-api.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { finalize, Observable, tap } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { NgxNoticeService, NoticeData } from '@digipay/ngx-notice';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DirectDebitContractStatus } from '../../data-access/model/direct-debit.model';

@Component({
  selector: 'direct-debit-applet-contract-management',
  standalone: true,
  imports: [DpIconComponent],
  templateUrl: './contract-management.component.html',
  styleUrl: './contract-management.component.scss',
  providers: [DirectDebitApiService],
})
export class ContractManagementComponent implements OnInit {
  private readonly message = inject(MessageService);
  private readonly api = inject(DirectDebitApiService);
  private readonly router = inject(Router);
  private readonly notice = inject(NgxNoticeService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  private readonly destroyRef = inject(DestroyRef);

  data!: { contractId: string; status: DirectDebitContractStatus };

  loading = signal<boolean>(false);
  public readonly directDebitContractStatus = DirectDebitContractStatus;

  ngOnInit(): void {
    this.data = this.bottomSheetService.data();
  }

  private confirmAndRun(config: NoticeData, onConfirm: () => Observable<any>, openNotice = true) {
    const runAction = () => {
      onConfirm()
        .pipe(finalize(() => this.bottomSheetService.closeBottomSheet()))
        .subscribe({
          error: (err) => this.message.showErrorOfErrorResponse(err),
        });
    };

    if (!openNotice) {
      runAction();
      return;
    }

    this.notice.openModal(config);

    const noticeSubscription = this.notice
      .afterClosed()
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        noticeSubscription.unsubscribe();
        if (result === 'primary') runAction();
      });
  }

  private cancelContract(redirectUrl: string) {
    this.loading.set(true);

    return this.api.cancelContract(this.data).pipe(
      finalize(() => this.loading.set(false)),
      tap(() => {
        this.message.showSuccessMessage('قرارداد پرداخت مستقیم شما با موفقیت لغو شد');
        this.router.navigate([redirectUrl]);
      }),
    );
  }

  private activeContract(redirectUrl: string) {
    this.loading.set(true);

    return this.api.activateContract(this.data).pipe(
      finalize(() => this.loading.set(false)),
      tap(() => {
        this.message.showSuccessMessage('قرارداد پرداخت مستقیم شما با موفقیت فعال شد');
        this.router.navigate([redirectUrl]);
      }),
    );
  }

  private deactivateContract(redirectUrl: string) {
    this.loading.set(true);

    return this.api.deactivateContract(this.data).pipe(
      finalize(() => this.loading.set(false)),
      tap(() => {
        this.message.showSuccessMessage('قرارداد پرداخت مستقیم شما با موفقیت غیرفعال شد');
        this.router.navigate([redirectUrl]);
      }),
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

  onChangeCancelContract() {
    this.confirmAndRun(
      {
        state: 'warning',
        title: 'لغو مجوز',
        description: `مجوز پرداخت مستقیم شما لغو خواهد شد.`,
        primaryButtonLabel: 'لغو مجوز',
        primaryButtonStyle: 'fill',
        secondaryButtonLabel: 'انصراف',
        secondaryButtonStyle: 'tinted-on-elevated',
        isHorizontalAction: true,
        position: 'bottom-center',
      },
      () => this.cancelContract('/direct-debit/list'),
    );
  }

  onChangeActiveContract() {
    this.confirmAndRun(
      {
        state: 'info',
        title: 'فعال سازی مجدد ',
        description: `مجوز پرداخت مستقیم شما فعال خواهد شد.`,
        primaryButtonLabel: 'فعال سازی مجدد',
        primaryButtonStyle: 'fill',
        secondaryButtonLabel: 'انصراف',
        secondaryButtonStyle: 'tinted-on-elevated',
        isHorizontalAction: true,
        position: 'bottom-center',
      },
      () => this.activeContract('/direct-debit/list'),
      false,
    );
  }

  onChangeDeactivateContract() {
    this.confirmAndRun(
      {
        state: 'warning',
        title: 'غیرفعال‌سازی موقت',
        description: `پرداخت مستقیم شما غیرفعال خواهد شد. برای فعالسازی مجدد باید از صفحه مدیریت پرداخت مستقیم اقدام کنید.`,
        primaryButtonLabel: 'تایید',
        primaryButtonStyle: 'fill',
        secondaryButtonLabel: 'انصراف',
        secondaryButtonStyle: 'tinted-on-elevated',
        isHorizontalAction: true,
        position: 'bottom-center',
      },
      () => this.deactivateContract('/direct-debit/list'),
    );
  }
}
