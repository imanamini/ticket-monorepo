import { Component, OnInit } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { InternetTemplateData } from '../../../api/clients/models/templates/internet/internet-template-data';
import { PageDataService } from '../../services/page-data.service';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiSimilarServicesComponent } from '../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { UiBasicSegmentExplanationComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment-explanation/ui-basic-segment-explanation.component';
import { InternetProductComponent } from './internet-product/internet-product.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-internet',
  templateUrl: './internet.component.html',
  styleUrls: ['./internet.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    InternetProductComponent,
    UiBasicSegmentExplanationComponent,
    UiSimilarServicesComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class InternetComponent implements OnInit {
  internetPageData!: Page<InternetTemplateData>;

  loaded = false;

  constructor(private pageDataService: PageDataService) {}

  ngOnInit(): void {
    this.pageDataService.getPageData('p', 'internet').subscribe((res) => {
      this.internetPageData = res.page;
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
