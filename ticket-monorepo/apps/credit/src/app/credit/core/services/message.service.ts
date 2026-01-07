import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(
    private _snackBar: MatSnackBar
  ) {
  }

  showMessage(body: string, title?: string): void {
    this._snackBar.open(body, title, {
      duration: 3000
    });
  }

  showErrorMessage(body: string, title?: string): void {
    this._snackBar.open(body, title, {
      duration: 3000,
      panelClass: 'warn-snack'
    });
  }

  hasMessage(response) {
    return response.result && response.result.message;
  }

  showErrorIfExists(response: any) {
    if (this.hasMessage(response)) {
      this.showErrorMessage(response.result.message);
    }
  }

}
