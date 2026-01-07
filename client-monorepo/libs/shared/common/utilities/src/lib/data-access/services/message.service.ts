import { inject, Injectable } from '@angular/core';
import { SnackbarService } from '@digipay/ngx-snackbar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  snackbarService = inject(SnackbarService);

  showErrorMessage(message: string, description?: string): void {
    this.snackbarService.openSnackBar({ message: message, description: description, status: 'error' });
  }

  showWarningMessage(
    message: string,
    description?: string,
    leftAction?: {
      showButton: boolean;
      buttonText: string;
      closeButton: boolean;
    },
  ): void {
    this.snackbarService.openSnackBar({
      message,
      status: 'warning',
      description,
      leftAction,
    });
  }

  showWarningMessageWithDescription({ message, description }: { message: string; description: string }): void {
    this.snackbarService.openSnackBar({ message, status: 'warning', description });
  }

  showSuccessMessage(message: string): void {
    this.snackbarService.openSnackBar({ message: message });
  }

  showErrorOfErrorResponse(error: any, defaultMessage = 'خطای فنی به وجود آمده، لطفا دوباره سعی کنید', description?: string): void {
    this.showErrorMessage(error?.error?.result?.message || error?.result?.message || defaultMessage, description);
  }

  showInfoMessage(message: string): void {
    this.snackbarService.openSnackBar({ message: message, status: 'info' });
  }

  getMessageIfHasAny(responseOrError: any | HttpErrorResponse): string {
    const object = responseOrError instanceof HttpErrorResponse ? responseOrError.error : responseOrError;
    if (this.hasMessage(object)) {
      return object.result.message;
    }
    return '';
  }

  hasMessage(response: any) {
    if (response && response.result && response.result.message) return response.result && response.result.message;
  }

  showErrorIfExists(response: any): void {
    if (response.error && response.error.result && response.error.result.message) {
      this.showErrorMessage(response.error.result.message);
    }
  }

  showApiSuccess(r: any): void {
    if (r && r.result && r.result.message) {
      this.showSuccessMessage(r.result.message);
    } else {
      this.showSuccessMessage('عملیات با موفقیت انجام شد');
    }
  }
}
