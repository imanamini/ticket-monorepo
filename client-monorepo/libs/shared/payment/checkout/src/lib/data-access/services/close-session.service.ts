import { inject, Injectable } from '@angular/core';
import { StorageService } from '@client-monorepo/common/utilities';

@Injectable({
  providedIn: 'root',
})
export class CloseSessionService {
  storageService = inject(StorageService);
  public close(): void {
    // todo handle navigation
    // const callbackUrl = this.storageService.getCallbackUrl();
    // NavigateToExternalUrl(callbackUrl);
  }
}
