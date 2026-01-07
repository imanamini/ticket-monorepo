import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() {
  }

  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setLoading(value: boolean): void {
    this.loadingSubject.next(value);
  }

  getLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }
}
