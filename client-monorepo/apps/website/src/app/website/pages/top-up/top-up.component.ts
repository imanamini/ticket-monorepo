import { Component, OnInit } from '@angular/core';
import { TopUpApiService } from '../../../api/digipay/top-up-api.service';
import { Page } from '../../../api/clients/models/content/page';
import { TopUpTemplateData } from '../../../api/clients/models/templates/top-up/top-up-template-data';
import { PageDataService } from '../../services/page-data.service';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiSimilarServicesComponent } from '../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { UiBasicSegmentExplanationComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment-explanation/ui-basic-segment-explanation.component';
import { TopUpProductComponent } from './top-up-product/top-up-product.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { delay, Observable, of } from 'rxjs';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    TopUpProductComponent,
    UiBasicSegmentExplanationComponent,
    UiSimilarServicesComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class TopUpComponent implements OnInit {
  topUpPage!: Page<TopUpTemplateData>;

  isMobile = false;

  loaded = false;

  constructor(
    private topUpApiService: TopUpApiService,
    private pageDataService: PageDataService,
  ) {}

  ngOnInit(): void {
    this.pageDataService.getPageData('p', 'top-up').subscribe((res) => {
      this.topUpPage = res.page;
      this.finishOpening().subscribe({
        next: () => {
          this.loaded = true;
        },
      });
    });
  }

  private finishOpening(): Observable<string> {
    return of('').pipe(delay(1));
  }
}
