import { NgIf } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, computed, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxNoticeService, noticeResult } from '@digipay/ngx-notice';
import { ReserveStatus } from '../../models/reserve-status.enum';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
import { ReturnApiService } from '../../services/return-api.service';
import { desktopFriendlyFlow } from '@client-monorepo/common/utilities';

@Component({
  selector: 'app-delivery-by-post-preview-dialog',
  templateUrl: './delivery-by-post-preview-dialog.component.html',
  styleUrl: './delivery-by-post-preview-dialog.component.scss',
  standalone: true,
  imports: [NgxButtonComponent, NgxCalloutComponent, PipesModule, NgIf],
  providers: [NgxNoticeService],
})
export class DeliveryByPostPreviewDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeliveryByPostPreviewDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly ReserveStatus = ReserveStatus;
  readonly loading = signal(false);

  guideTmpl = viewChild<TemplateRef<any>>('guideTmpl');

  attentions = computed(() => {
    const messages = ['برای دریافت چک حضور وام‌گیرنده الزامی است.'];

    if (this.data.reserveStatus !== ReserveStatus.Pending) {
      messages.push(
        'اگر وام شما تسویه شده است، نگران نباشید! دیجی پی چک شما را ظرف دو هفته کاری باطل می کند. در غیر این صورت، لطفاً برای ابطال چک ضمانت، به شعبه بانک خود مراجعه فرمایید.',
      );
    }

    return messages;
  });

  constructor(
    public dialog: MatDialog,
    private noticeService: NgxNoticeService,
    private api: ReturnApiService,
  ) {}

  get canEdit() {
    return this.data?.reserve.reserveStatus.value !== ReserveStatus.Locked;
  }

  get address() {
    if (this.data.address.streetAddress) {
      return `${this.data.address.streetAddress} پلاک ${this.data.address.no} واحد ${this.data.address.unit}`;
    }
    return `${this.data.address} پلاک ${this.data.no} واحد ${this.data.unit}`;
  }

  get description() {
    switch (this.data.reserveStatus) {
      case ReserveStatus.Locked:
        return {
          title: 'درخواست شما با اطلاعات زیر ثبت شده است. ',
          subTitle: 'امکان ویرایش درخواست وجود ندارد.',
        };

      case ReserveStatus.Reserved:
        return {
          title: 'درخواست شما با اطلاعات زیر ثبت شده، شما می‌توانید در صورت نیاز اقدام به ویرایش آن کنید.',
        };

      case ReserveStatus.Pending:
        return {
          title: 'اطلاعات زیر را بررسی و تایید کنید:',
        };
    }
  }

  edit(): void {
    if (this.data.reserveStatus === ReserveStatus.Pending) {
      return this.dialogRef.close();
    }

    this.noticeService.openModal({
      state: 'info',
      description: 'تایید شما به منزله حذف درخواست قبلی و شروع مجدد فرآیند است.\n' + 'آیا از ویرایش درخواست و شرایط ارسال اطمینان دارید؟',
      title: 'ویرایش درخواست',
      primaryButtonLabel: 'بله',
      secondaryButtonLabel: 'خیر',
      secondaryButtonStyle: 'tinted-on-elevated',
      isHorizontalAction: true,
      brandButton: true,
      position: 'center',
      secondaryFullWidthButton: true,
      width: !desktopFriendlyFlow() ? '100%' : '460px',
    });

    const afterClosedSubject = this.noticeService.afterClosed();
    if (afterClosedSubject) {
      const subscription = afterClosedSubject.subscribe((data: noticeResult) => {
        if (data === 'primary') {
          this.dialogRef.close();
        }
        subscription.unsubscribe();
      });
    }
  }

  submitReturnPost() {
    this.loading.set(true);

    this.api.submitReturnPost(this.data.returnPostRequestModal).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.dialogRef.close({ status: 'success' });
        this.onSubmitSuccess();
      },
      error: (err) => {
        this.loading.set(false);
        this.onSubmitFailed(err, () => this.submitReturnPost());
      },
    });
  }

  private onSubmitSuccess() {
    this.dialogRef.close();

    const _dialogRef = this.dialog.open(ResultDialogComponent, {
      panelClass: 'return-dialog-panel',
      disableClose: true,
      width: '430px',
      data: {
        status: 'success',
      },
    });

    const _dialogSub = _dialogRef.afterClosed().subscribe((res) => {
      _dialogSub.unsubscribe();
      if (res === 'guide') {
        this.openGuideDialog();
      }
    });
  }

  private openGuideDialog() {
    this.dialog.open(this.guideTmpl(), {
      panelClass: 'guide-dialog-panel',
      disableClose: true,
      width: '410px',
      height: '450px',
    });
  }

  private onSubmitFailed(err: HttpErrorResponse, retryFn: () => void) {
    const _dialogRef = this.dialog.open(ResultDialogComponent, {
      panelClass: 'return-dialog-panel',
      disableClose: true,
      width: '430px',
      data: {
        status: 'error',
        error: err,
      },
    });

    const _dialogSub = _dialogRef.afterClosed().subscribe((res) => {
      _dialogSub.unsubscribe();
      if (res === 'retry' && err.status === HttpStatusCode.InternalServerError) {
        retryFn();
      }
    });
  }
}
