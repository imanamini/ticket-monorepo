import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FatalErrorService {
  /**
   * Hold the current error's message
   */
  errorMessage: BehaviorSubject<string> = new BehaviorSubject(null);

  setError(error: string): void {
    this.errorMessage.next(error);
  }
}
