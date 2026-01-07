import { inject, Injectable } from '@angular/core';
import { CreditBlockedErrorData } from '../../components/credit-no-service-dialog/credit-blocked-error-data';
import { CreditNoServiceDialogComponent } from '../../components/credit-no-service-dialog/credit-no-service-dialog.component';
import { SnackbarService } from '@digipay/ngx-snackbar';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  snackbarService = inject(SnackbarService);
  bottomSheetService = inject(NgxBottomSheetService);

  showErrorMessage(message: string): void {
    this.snackbarService.openSnackBar({ message: message, status: 'error' });
  }

  showSuccessMessage(message: string): void {
    this.snackbarService.openSnackBar({ message: message });
  }

  showErrorOfErrorResponse(error: any, defaultMessage = 'خطای فنی به وجود آمده، لطفا دوباره سعی کنید'): void {
    this.showErrorMessage(error?.error?.result?.message || error?.result?.message || defaultMessage);
  }

  showMessage(body: string): void {
    this.snackbarService.openSnackBar({ message: body, status: 'info' });
  }

  showWarnMessage(body: string): void {
    this.snackbarService.openSnackBar({ message: body, status: 'warning' });
  }

  hasMessage(response: any) {
    return response && response.result && response.result.message;
  }

  isNoServiceError(response: any): boolean {
    return response && response.result && response.result.status === 1118;
  }

  isNoSignUpSana(response: any): boolean {
    return response && response.result && response.result.status === 17735;
  }

  isEnoteExpiredError(response: any): boolean {
    return response && response.result && response.result.status === 5344;
  }

  getMessageIfItHas(error: any) {
    if (this.hasMessage(error)) {
      return error.result.message;
    }
    return null;
  }
  showErrorMessageWithDescription(message: string, description: string): void {
    this.snackbarService.openSnackBar({
      message: message,
      description: description,
      status: 'error',
      leftAction: {
        buttonText: '',
        showButton: false,
        closeButton: true,
      },
    });
  }

  showBlockedError(blockedError: CreditBlockedErrorData): Promise<{
    primary: boolean;
    secondary: boolean;
    back: boolean;
  }> {
    return new Promise<{
      primary: boolean;
      secondary: boolean;
      back: boolean;
    }>((resolve) => {
      this.bottomSheetService.openBottomSheet(
        CreditNoServiceDialogComponent,
        {
          title: blockedError.title,
          message: blockedError.message,
          staticImage: blockedError.staticImage,
          primaryCta: blockedError.primaryCta,
          secondaryCta: blockedError.secondaryCta,
          buttons: blockedError.buttons,
          pageTitle: blockedError.pageTitle,
          notBlocker: blockedError.notBlocker,
        },
        {
          height: '100%',
        },
      );

      const noServiceDialog = this.bottomSheetService.onClose.subscribe(() => {
        noServiceDialog.unsubscribe();
        const result = this.bottomSheetService.outputData();
        if (result) {
          resolve({
            primary: !!result.primary,
            secondary: !!result.secondary,
            back: !!result.back,
          });
        }
      });
    });
  }
}
