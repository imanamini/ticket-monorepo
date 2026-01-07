import {Component, effect, inject, Inject, PLATFORM_ID, signal} from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { BpgTemplateData } from '../../../api/clients/models/templates/bpg/bpg-template-data';
import { ContactForm } from '../../../api/clients/models/templates/contact-us/contact-form';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { SwiperOptions } from 'swiper/types';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { BpgFormComponent } from './bpg-form/bpg-form.component';
import { BpgPartnersComponent } from './bpg-partners/bpg-partners.component';
import { UiHorizontalFlowComponent } from '../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { UiBasicSegmentComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment/ui-basic-segment.component';
import { UiValueSectionComponent } from '../../../ui/ui-components/ui-value-cards/ui-value-section/ui-value-section.component';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import { ScrollToAnchorDirective } from '../../../ui/ui-directive/scroll-to-anchor.directive';
import { isPlatformBrowser } from '@angular/common';
import {UrlService} from "../../services/url.service";

@Component({
  selector: 'app-bpg',
  templateUrl: './bpg.component.html',
  styleUrls: ['./bpg.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    UiValueSectionComponent,
    UiBasicSegmentComponent,
    UiHorizontalFlowComponent,
    BpgPartnersComponent,
    BpgFormComponent,
    UiSeoComponent,
    UiFaqComponent,
    ScrollToAnchorDirective,
  ],
})
export class BpgComponent {
  bpgPage = signal<Page<BpgTemplateData> | undefined>(undefined);
  contactForm = signal<ContactForm | undefined>(undefined);
  loaded = signal(false);

  private urlService = inject(UrlService);
  valueSectionConfig: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    loop: true,
    slideToClickedSlide: true,
    breakpoints: {
      1280: {
        slidesPerView: 3,
      },
      576: {
        slidesPerView: 1.7,
        spaceBetween: 0,
      },
      320: {
        slidesPerView: 1.2,
      },
    },
  };

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const chat = document.createElement('script');
      chat.src = '/assets/scripts/ipg-bpg-goftino.js';
      document.body.appendChild(chat);
    }
    // Effect to handle page data fetching and initialization
    effect(
      () => {
        this.pageClient.getPage('p', 'bpg').subscribe((res) => {
          this.bpgPage.set(res.page);
          this.contactForm.set(res.contactForms[0]);
          this.seo.setGlobalMetaTagsFromPage(res.page);
          of('')
            .pipe(delay(500))
            .subscribe({
              next: () => {
                this.loaded.set(true);
              },
            });
        });
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  openLink(link: string) {
   this.urlService.handleLink(link);
  }
}
