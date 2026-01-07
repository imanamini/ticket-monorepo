import { Injectable } from '@angular/core';
import { Device } from '../../wallet/new-upg/models/device.type';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  public device(): Device {
    if (window.matchMedia('(max-width: 813px)').matches) {
      return 'MOBILE';
    }
    return 'DESKTOP';
  }
}
