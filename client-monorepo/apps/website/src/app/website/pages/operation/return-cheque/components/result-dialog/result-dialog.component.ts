import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-result-dialog',
  standalone: true,
  imports: [NgOptimizedImage, NgxStatusResultModule, CommonModule, NgxButtonComponent],
  templateUrl: './result-dialog.component.html',
  styleUrl: './result-dialog.component.scss',
  providers: [
    {
      provide: 'STATE_BOTTOM_SHEET',
      useClass: NgxBottomSheetService,
    },
  ],
})
export class ResultDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ResultDialogComponent>);
  private readonly injectedData = inject<{
    status: 'success' | 'error';
    error: HttpErrorResponse;
  }>(MAT_DIALOG_DATA);
  readonly data = signal(this.injectedData);
  readonly description = computed(() =>
    this.data().status === 'success'
      ? 'شیوه دریافت چک با موفقیت ثبت شد.'
      : 'در فرایند ثبت شیوه دریافت مشکلی پیش آمده، لطفا دوباره اقدام کنید.',
  );
  readonly errorMessage = computed(() => this.data().error?.error?.result?.message || '');
  readonly iconState = computed(() => ({
    size: 'large',
    state: this.data().status === 'success' ? 'done' : 'error',
  }));
  readonly buttons = computed(() => {
    const { error, status } = this.data();
    if (!error || status === 'success') return [];

    const isUnprocessable = error.status === HttpStatusCode.UnprocessableEntity;
    return [
      {
        id: isUnprocessable ? 'edit' : 'retry',
        mode: 'form',
        style: 'tinted-on-elevated',
        label: isUnprocessable ? 'متوجه شدم' : 'تلاش مجدد',
      },
    ];
  });

  retry() {
    this.dialogRef.close('retry');
  }

  closeAndEdit() {
    this.dialogRef.close('edit');
  }

  guide() {
    this.dialogRef.close('guide');
  }

  onClick(buttonId: string) {
    const actions: Record<string, () => void> = {
      retry: () => this.retry(),
      edit: () => this.closeAndEdit(),
      guide: () => this.guide(),
    };

    const action = actions[buttonId];
    if (action) {
      action();
    }
  }
}
