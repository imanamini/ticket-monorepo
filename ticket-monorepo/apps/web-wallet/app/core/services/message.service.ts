import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

  showMessage(body: string, title?: string): void {
    this.snackBar.open(body, title, {
      duration: 3000
    });
  }

  showSuccessMessage(body: string, title?: string): void {
    this.snackBar.open(body, title, {
      duration: 3000,
      panelClass: ['warn-snack','is-success']
    });
  }

  showErrorMessage(body: string, title?: string): void {
    this.snackBar.open(body, title, {
      duration: 3000,
      panelClass: ['warn-snack', 'is-danger']
    });
  }

  showErrorIfExists(response: any) {
    if (response.error && response.error.result && response.error.result.message) {
      this.showErrorMessage(response.error.result.message);
    }
  }

}
