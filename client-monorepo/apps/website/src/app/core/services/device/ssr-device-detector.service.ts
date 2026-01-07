import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { Request } from 'express';
import { DeviceDetectorService } from 'ngx-device-detector';
import { isPlatformServer } from '@angular/common';
import { REQUEST } from '../../../../../ssr/express.tokens';

@Injectable({
  providedIn: 'root',
})
export class SsrDeviceDetectorService extends DeviceDetectorService {
  constructor(@Inject(PLATFORM_ID) platformId: string, @Optional() @Inject(REQUEST) request: Request) {
    super(platformId);
    if (isPlatformServer(platformId)) {
      super.setDeviceInfo((request?.headers['user-agent'] as string) || '');
    }
  }
}
