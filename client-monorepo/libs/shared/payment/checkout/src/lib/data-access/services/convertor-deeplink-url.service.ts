import { inject, Injectable } from '@angular/core';
import { NgxHybridServiceService } from '@digipay/ngx-hybrid-service';

@Injectable({
  providedIn: 'root',
})
export class ConvertorDeepLinkToHttpsProtocol {
  private ngxHybridService = inject(NgxHybridServiceService);

  public convert(url: string): string {
    if (!this.ngxHybridService.isHybrid()) {
      return url;
    }

    const startsWithDgp = /^dgp:\/\//.test(url);
    if (!startsWithDgp) {
      console.log('آدرس دیپلینک نیست!');
      return url;
    }
    return url.replace(/^dgp:/, 'https:');
  }
}
