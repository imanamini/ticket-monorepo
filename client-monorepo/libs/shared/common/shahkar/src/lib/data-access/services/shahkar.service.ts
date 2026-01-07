import { inject, Injectable } from '@angular/core';
import { OverlayManagerConfig, OverlayManagerService } from '@client-monorepo/common/ui-components';
import { RegisterShahkarComponent } from '@client-monorepo/common/shahkar';
import { UserApiService } from '@client-monorepo/common/user';
import { ShahkarOverlayData } from '../models/shahkar-overlay-data';

@Injectable({
  providedIn: 'root',
})
export class ShahkarService {
  overlayManagerService = inject(OverlayManagerService);
  userApiService = inject(UserApiService);

  handleShahkarOverlay(data: ShahkarOverlayData = {}, config?: OverlayManagerConfig): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userApiService.getProfile().subscribe({
        next: (result) => {
          if (result && result.isNationalCodeVerified) {
            resolve(true);
            return;
          }
          this.overlayManagerService.displayOverlay(RegisterShahkarComponent, data, config).then((result) => {
            resolve(result);
          });
        },
        error: reject,
      });
    });
  }
}
