import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  constructor() {
  }

  private guideClicked: EventEmitter<Event> = new EventEmitter<Event>();

  setGuideClicked(e: Event): void {
    this.guideClicked.next(e);
  }

  getGuideClicked(): Observable<Event> {
    return this.guideClicked.asObservable();
  }
}
