import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DownloadSectionData } from '../../../api/clients/models/templates/download/download-data.response';
import { RouterLink } from '@angular/router';
import { DownloadAppLinkDirective } from '../../../ui/ui-directive/download-app-link.directive';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { CollapsiblePlusSignComponent } from '../../../ui/ui-components/ui-icons/collapsible-plus-sign/collapsible-plus-sign.component';
import { isPlatformBrowser, NgClass, NgOptimizedImage } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-l-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [NgClass, CollapsiblePlusSignComponent, RouterLink, UiButtonComponent, DownloadAppLinkDirective, NgOptimizedImage, NgxIcon],
})
export class FooterComponent implements OnInit {
  selectedTab = 0;

  selectedStep = 0;

  resanehHypertextReference = '';
  resanehId = '';
  resanehLogoPath = '';

  enamadHypertextReference = '';
  enamndId = '';
  enamadLogoPath = '';

  shamadHypertextReference = '';

  @Input()
  isHome = false;

  downloadApp: DownloadSectionData | undefined = undefined;
  currentDomain = '';

  constructor(@Inject(PLATFORM_ID) public platformId: string) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentDomain = document.location.hostname;
      this.enamadHrefHandler();
      this.resanehHrefHandler();
      this.shamadHrefHandler();
    }
  }

  changeStep(stepIndex: number) {
    if (this.selectedStep === stepIndex) {
      this.selectedStep = -1;
    } else {
      this.selectedStep = stepIndex;
    }
    this.selectedTab = 0;
  }

  enamadHrefHandler() {
    switch (this.currentDomain) {
      case 'www.mydigipay.com':
      case 'mydigipay.com': {
        this.enamadHypertextReference = 'https://trustseal.enamad.ir/?id=140000&Code=uRw7AnjLqvHolCe6MOxF';
        this.enamndId = 'uRw7AnjLqvHolCe6MOxF';
        this.enamadLogoPath = 'https://Trustseal.eNamad.ir/logo.aspx?id=140000&Code=uRw7AnjLqvHolCe6MOxF';
        break;
      }
      case 'www.digipay.ir':
      case 'digipay.ir': {
        this.enamadHypertextReference = 'https://trustseal.enamad.ir/?id=316449&Code=c5oFAjqjBLdDLgfQiMPW';
        this.enamndId = 'c5oFAjqjBLdDLgfQiMPW';
        this.enamadLogoPath = 'https://Trustseal.eNamad.ir/logo.aspx?id=316449&Code=c5oFAjqjBLdDLgfQiMPW';
        break;
      }
      case 'www.mydigipay.ir':
      case 'mydigipay.ir': {
        this.enamadHypertextReference = 'https://trustseal.enamad.ir/?id=494963&Code=iNIVa8p2iexE1wdNoKebhZ50ZLLXMCYU';
        this.enamndId = 'iNIVa8p2iexE1wdNoKebhZ50ZLLXMCYU';
        this.enamadLogoPath = 'https://Trustseal.eNamad.ir/logo.aspx?id=494963&Code=iNIVa8p2iexE1wdNoKebhZ50ZLLXMCYU';
        break;
      }
    }
  }

  resanehHrefHandler() {
    switch (this.currentDomain) {
      case 'www.mydigipay.com':
      case 'mydigipay.com': {
        this.resanehHypertextReference = 'https://logo.samandehi.ir/Verify.aspx?id=163588&p=rfthgvkaxlaodshwmcsimcsi';
        this.resanehId = 'jxlzfukzrgvjapfuoeukoeuk';
        this.resanehLogoPath = 'https://logo.samandehi.ir/logo.aspx?id=163588&p=nbpdwlbqqftiujynaqgwaqgw';
        break;
      }
      case 'www.digipay.ir':
      case 'digipay.ir': {
        this.resanehHypertextReference = 'https://logo.samandehi.ir/Verify.aspx?id=301576&p=xlaoobpdrfthdshwjyoegvka';
        this.resanehId = 'rgvjesgtjxlzapfujzpefukz';
        this.resanehLogoPath = 'https://logo.samandehi.ir/logo.aspx?id=301576&p=qftilymanbpdujynyndtwlbq';
        break;
      }
      case 'www.mydigipay.ir':
      case 'mydigipay.ir': {
        this.resanehHypertextReference = 'https://logo.samandehi.ir/Verify.aspx?id=359932&p=xlaodshwpfvlpfvlxlaouiwk';
        this.resanehId = 'rgvjapfusizpsizprgvjnbqe';
        this.resanehLogoPath = 'https://logo.samandehi.ir/logo.aspx?id=359932&p=qftiujynbsiybsiyqftiodrf';
        break;
      }
    }
  }

  shamadHrefHandler() {
    switch (this.currentDomain) {
      case 'www.mydigipay.com':
      case 'mydigipay.com': {
        this.shamadHypertextReference = 'https://logo.saramad.ir/verify.aspx?CodeShamad=1-2-767877-63-0-1';
        break;
      }
      case 'www.digipay.ir':
      case 'digipay.ir': {
        this.shamadHypertextReference = 'https://logo.saramad.ir/verify.aspx?CodeShamad=1-2-767877-63-0-2';
        break;
      }
      case 'www.mydigipay.ir':
      case 'mydigipay.ir': {
        this.shamadHypertextReference = '';
        break;
      }
    }
  }

  onVerifyResaneh() {
    if (this.resanehHypertextReference !== '') {
      window.open(
        this.resanehHypertextReference,
        'Popup',
        'toolbar=no, scrollbars=no, location=no, statusbar=no, menubar=no, resizable=0, width=450, height=630, top=30',
      );
    }
  }

  goToUPGDocs() {
    window.open('https://www.mydigipay.com/developers/docs/upg/', '_blank');
  }
}
