import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SwitchOption } from '../models/switch-option.model';

@Injectable({
  providedIn: 'root'
})
export class SwitchService {

  private selectedTab: BehaviorSubject<SwitchOption> = new BehaviorSubject<SwitchOption>(null);

  constructor() {
  }

  getSelectedTab(): Observable<SwitchOption> {
    return this.selectedTab.asObservable();
  }

  setSelectedTab(data: SwitchOption): void {
    this.selectedTab.next(data);
  }

  getSelectedTabValue(): SwitchOption {
    return this.selectedTab.getValue();
  }

}
