import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureToggleService {
  public featureToggleSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public featureToggle$ = this.featureToggleSource.asObservable();

  public featureToggle(show: boolean): void {
    this.featureToggleSource.next(show);
  }
}
