import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReloadAlertService{
  reload = new BehaviorSubject<{ change: boolean }>({ change: false });
}
