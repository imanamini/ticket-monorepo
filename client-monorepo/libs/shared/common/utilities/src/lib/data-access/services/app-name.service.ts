import { inject, Injectable } from '@angular/core';
import { APP_NAME, APP_NAME_ENUM } from '../constants/tokens';

@Injectable({
  providedIn: 'root',
})
export class AppNameService {
  private appName = inject(APP_NAME);

  getAppName(): APP_NAME_ENUM {
    return this.appName;
  }

  isDpx(): boolean {
    return this.getAppName() === APP_NAME_ENUM.DPX;
  }

  isExpress(): boolean {
    return this.getAppName() === APP_NAME_ENUM.EXPRESS;
  }

  isPillar(): boolean {
    return this.getAppName() === APP_NAME_ENUM.PILLAR;
  }
}
