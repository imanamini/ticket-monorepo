import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { SharedUserSourceService } from './shared-user-source.service';

@Injectable({
  providedIn: 'root'
})

export class PinService {
  private sharedUserSourceService = inject(SharedUserSourceService);

  getCheckPinResolveSubject(): Observable<any> {
    return this.sharedUserSourceService.checkPinResolveSubject.asObservable();
  }

  setCheckPinResultSubject(value: any): void {
    this.sharedUserSourceService.checkPinResolveSubject.next(value);
  }
}
