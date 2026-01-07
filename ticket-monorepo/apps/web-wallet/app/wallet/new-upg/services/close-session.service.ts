import { Injectable } from '@angular/core';
import { GetCallbackUrl } from '../../../utils/storage';
import { NavigateToExternalUrl } from '../../../utils/navigation';

@Injectable()
export class CloseSessionService {

  public close(): void {
    const callbackUrl = GetCallbackUrl();
    NavigateToExternalUrl(callbackUrl);
  }
}
