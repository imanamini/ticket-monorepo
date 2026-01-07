import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CellNumberItemBottomSheetService {
  protected update: Subject<boolean> = new Subject<boolean>();

  onReloadRequest() {
    return this.update.asObservable();
  }

  reload() {
    this.update.next(true);
  }
}
