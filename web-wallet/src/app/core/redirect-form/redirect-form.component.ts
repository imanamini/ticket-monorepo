import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RedirectService } from '../services/redirect.service';
import { isApplicationUrl } from '../../utils/url';

@Component({
  selector: 'app-redirect-form',
  templateUrl: './redirect-form.component.html'
})
export class RedirectFormComponent implements OnInit {

  constructor(
    private redirectService: RedirectService
  ) {

    this.redirectService.url.asObservable().subscribe(url => {
      this.url = url;
    });

    this.redirectService.formData.asObservable().subscribe(formData => {
      this.data = formData;
    });

    this.redirectService.redirect.asObservable().subscribe(redirectMethod => {
      if (redirectMethod && this.url) {
        const urlIsForWebApp: boolean = RedirectFormComponent.checkUrlIsForWebApp(this.url);
        this.method = urlIsForWebApp ? 'GET' : redirectMethod;
        setTimeout(() => {
          this.redirect();
        }, 10);
      }
    });
  }

  url: string;

  data: Array<{
    key: string,
    value: any,
  }> = [];

  @ViewChild('formElement', {
    static: false,
  })
  formElement: ElementRef<HTMLFormElement>;

  method = 'POST';

  private static checkUrlSupportingPostMethod(url: string): boolean {
    const appUrlRegex = new RegExp('^https?:\\/\\/(\\w+[-\\w]*)?\\.mydigipay\\.(com|info)(\\/|\\/.+)?$');
    const localhostRegex = new RegExp('^http:\\/\\/localhost:\\d{2,9}(\\/|\\/.+)?$');
    return appUrlRegex.test(url) || localhostRegex.test(url);
  }


  private static checkUrlIsForWebApp(url: string): boolean {
    const appUrlRegex = new RegExp('^https?:\\/\\/(\\w+[-\\w]*)?\\.mydigipay\\.(com|info)(\\/|\\/.+)?$');
    const localhostRegex = new RegExp('^http:\\/\\/localhost:\\d{2,9}(\\/|\\/.+)?$');
    const isFromUs = appUrlRegex.test(url) || localhostRegex.test(url);
    const isFromBackEnd = url.includes('digipay/api') || url.startsWith('https://api.') || url.startsWith('https://uat.');
    return isFromUs && !isFromBackEnd;
  }

  ngOnInit() {
  }

  redirect() {
    if (isApplicationUrl(this.url)) {
      const appData = RedirectService.arrayToAppData(this.data);
      // redirect to the mobile applications
      // (custom url scheme)
      RedirectService.redirectToApp(this.url, appData);
    } else {
      this.formElement.nativeElement.submit();
    }
  }
}
