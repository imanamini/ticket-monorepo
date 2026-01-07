import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class MessageService {

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  showMessage(body: string, title?: string): void {
    this.snackBar.open(body, title, {
      duration: 3000,
      panelClass: [
        'is-success'
      ]
    });
  }

  showErrorMessage(body: string, title?: string): void {
    this.snackBar.open(body, title, {
      duration: 3000,
      panelClass: [
        'is-danger'
      ]
    });
  }

  hasMessage(response: any | HttpErrorResponse): boolean {
    if (!response) {
      return false;
    }
    if (response instanceof HttpErrorResponse) {
      return response.error.result && response.error.result.message;
    }

    return response.result && response.result.message;
  }

  showMessageOfResponse(response: any): void {
    if (this.hasMessage(response)) {
      const m = this.getMessageIfHasAny(response);
      this.showMessage(m);
    }
  }

  showErrorIfExists(response: HttpErrorResponse): void {
    if (this.hasMessage(response)) {
      this.showErrorMessage(response.error.result.message);
    }
  }

  getMessageIfHasAny(responseOrError: any | HttpErrorResponse, defaultMessage = ''): string {
    const object = responseOrError instanceof HttpErrorResponse ? responseOrError.error : responseOrError;
    if (this.hasMessage(object)) {
      return object.result.message;
    }
    return defaultMessage;
  }

}
