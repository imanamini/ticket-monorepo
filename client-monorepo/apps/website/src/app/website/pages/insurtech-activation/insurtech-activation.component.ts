import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { InsurtechTemplateData } from '../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { SwiperOptions } from 'swiper/types';
import { PageClient } from '../../../api/clients/page-client';
import { SeoService } from '../../services/seo.service';
import { InsurtechActivationTemplateData } from '../../../api/clients/models/templates/insurtech-activation/insurtech-activation-template-data';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSimilarServicesComponent } from '../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { InsurtechServicesProcessesComponent } from '../insurtech/insurtech-services-processes/insurtech-services-processes.component';
import { InsurtechRecoverableComponent } from '../insurtech/insurtech-recoverable-damages/insurtech-recoverable/insurtech-recoverable.component';
import { InsurtechActivationIntroComponent } from './insurtech-activation-intro/insurtech-activation-intro.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-insurtech-activation',
  templateUrl: './insurtech-activation.component.html',
  styleUrls: ['./insurtech-activation.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    InsurtechActivationIntroComponent,
    InsurtechRecoverableComponent,
    InsurtechServicesProcessesComponent,
    UiSimilarServicesComponent,
    UiFaqComponent,
  ],
})
export class InsurtechActivationComponent implements OnInit {
  insurtechPage!: Page<InsurtechTemplateData>;

  insurtechActivationPage!: Page<InsurtechActivationTemplateData>;

  serviceActiveIndex = 0;

  loaded = false;

  config: SwiperOptions = {
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    loop: false,
    slideToClickedSlide: true,
    slidesPerView: 1,
  };

  constructor(
    private pageClient: PageClient,
    private seo: SeoService,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('insurtech', 'equipment').subscribe((res) => {
      this.insurtechPage = res.page;
    });

    this.pageClient.getPage('insurtech', 'activation').subscribe((res) => {
      this.insurtechActivationPage = res.page;
      this.seo.setGlobalMetaTagsFromPage(res.page);
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }
}
