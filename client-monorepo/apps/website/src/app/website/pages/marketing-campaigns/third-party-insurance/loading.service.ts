import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

export interface SpinnerState {
  status: 'hidden' | 'loading' | 'error';
  title?: string;
  subtitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _spinnerSubject = new BehaviorSubject<SpinnerState>({status: 'hidden'});

  public readonly spinnerState$ = this._spinnerSubject.asObservable();

  constructor() {
  }


  showLoading(title?: string, subtitle?: string): void {
    this._spinnerSubject.next({
      status: 'loading',
      title: title ?? null,
      subtitle: subtitle ?? null,
    });
  }

  showError(title?: string, subtitle?: string): void {
    this._spinnerSubject.next({
      status: 'error',
      title: title ?? null,
      subtitle: subtitle ?? null,
    });

  }

  hide(): void {
    this._spinnerSubject.next({status: 'hidden'});
  }

}
