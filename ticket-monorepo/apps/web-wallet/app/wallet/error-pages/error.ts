import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { Location } from '@angular/common';
import { GetCallbackUrl } from '../../utils/storage';
import { NavigateToExternalUrl } from '../../utils/navigation';

export class Error {
  private domSanitizer = inject(DomSanitizer);
  private location = inject(Location);

  public submit() {
    // back
    this.location.back();
  }

  public back(): void {
    // return to merchant and clear storage.
    const callbackUrl = GetCallbackUrl();
    NavigateToExternalUrl(callbackUrl);
  }

  public getSafeUrl(logoPath): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(logoPath);
  }
}
