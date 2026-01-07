import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private saveRoutesSubject = new BehaviorSubject<string>('');
  PreSub$ = this.saveRoutesSubject.asObservable();
  lastRoute = '';

  constructor() {
    this.PreSub$.subscribe((val) => {
      this.lastRoute = val || '';
    });
  }

  public saveRoute(route: string) {
    this.saveRoutesSubject.next(route);
  }

  public getRoutes() {
    return this.lastRoute;
  }
}
