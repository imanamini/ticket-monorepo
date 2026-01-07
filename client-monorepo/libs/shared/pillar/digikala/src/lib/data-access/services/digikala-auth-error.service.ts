import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DigikalaAuthErrorService {
  private authError = signal<HttpErrorResponse | null>(null);

  setAuthError(error: HttpErrorResponse | null): void {
    this.authError.set(error);
  }

  getAuthError(): HttpErrorResponse | null {
    return this.authError();
  }

  clearAuthError(): void {
    this.authError.set(null);
  }

  hasPasswordError(): boolean {
    const error = this.authError();
    if (error && error.status === 401) {
      const errorBody = error.error;
      // Check if status is in result object
      return errorBody?.result?.status === 2001;
    }
    return false;
  }
}
