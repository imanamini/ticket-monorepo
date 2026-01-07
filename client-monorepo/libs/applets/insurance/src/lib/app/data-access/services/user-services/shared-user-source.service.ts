import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { RedirectAfterLoginData } from '../../../features/auth/models/auth.model';

@Injectable({
  providedIn: 'root'
})

export class SharedUserSourceService {
  public isLoggedInSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public afterLoginData = new BehaviorSubject<RedirectAfterLoginData | null>(null);
  public checkPinResolveSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public userHasPassword: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  globalCellNumber: BehaviorSubject<string> = new BehaviorSubject('');
  globalUserId: BehaviorSubject<string> = new BehaviorSubject('');
  globalIsAutofill: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}
