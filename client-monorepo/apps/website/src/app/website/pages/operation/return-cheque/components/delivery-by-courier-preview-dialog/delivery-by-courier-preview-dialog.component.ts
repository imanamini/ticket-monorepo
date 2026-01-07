import { NgIf, SlicePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxNoticeService, noticeResult } from '@digipay/ngx-notice';
import { ReserveStatus } from '../../models/reserve-status.enum';
import { ReturnApiService } from '../../services/return-api.service';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { desktopFriendlyFlow } from '@client-monorepo/common/utilities';

@Component({
  selector: 'app-delivery-by-courier-preview-dialog',
  standalone: true,
  imports: [NgxButtonComponent, NgxCalloutComponent, PipesModule, SlicePipe, NgIf],
  providers: [NgxNoticeService],
  templateUrl: './delivery-by-courier-preview-dialog.component.html',
  styleUrl: './delivery-by-courier-preview-dialog.component.scss',
})
export class DeliveryByCourierPreviewDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeliveryByCourierPreviewDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly ReserveStatus = ReserveStatus;
  loading = signal(false);

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
      return `${this.data.address.streetAddress}`;
    }
    return this.data.address;
  }

  async submitReturnCourier() {
    this.loading.set(true);
    this.api.submitReturnCourier(this.data.returnCourierRequestModal).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.onSubmitSuccess();
      },
      error: (err) => {
        this.loading.set(false);
        this.onSubmitFailed(err, () => this.submitReturnCourier());
      },
    });
  }

  private onSubmitSuccess() {
    this.dialogRef.close();

    this.dialog.open(ResultDialogComponent, {
      panelClass: 'return-dialog-panel',
      disableClose: true,
      width: '430px',
      data: {
        status: 'success',
      },
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
        return retryFn();
      }
    });
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
      secondaryFullWidthButton: true,
      position: 'center',
      width: !desktopFriendlyFlow() ? '100%' : '460px'
    });

    const subscription = this.noticeService.afterClosed().subscribe((data: noticeResult) => {
      if (data === 'primary') {
        this.dialogRef.close();
      }
      subscription.unsubscribe();
    });
  }

  submit() {
    this.dialogRef.close('submit');
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
}
