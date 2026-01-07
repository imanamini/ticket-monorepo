import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmittingDataEnum } from '../models/emitting-data.enum';

@Injectable({
  providedIn: 'root',
})
export class EmitterService {
  private dataSource = new BehaviorSubject<EmittingDataEnum>(
    EmittingDataEnum.NONE,
  );
  public sharedData = this.dataSource.asObservable();

  public emitEvent(eventType: EmittingDataEnum): void {
    this.dataSource.next(eventType);
  }
}
