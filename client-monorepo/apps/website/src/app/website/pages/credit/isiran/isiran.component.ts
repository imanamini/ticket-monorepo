import { Component, OnInit } from '@angular/core';
import { Page } from '../../../../api/clients/models/content/page';
import { IsiranTemplateData } from '../../../../api/clients/models/templates/isiran/isiran-template-data';
import { SeoService } from '../../../services/seo.service';
import { PageClient } from '../../../../api/clients/page-client';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditMerchants } from '../../../../api/clients/models/templates/credit-v3/credit-config.response';
import { MerchantsApiService } from '../../../../api/clients/credit/merchants-api.service';
import { ISIRAN_DATA } from './isiran.data';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiHorizontalFlowComponent } from '../../../../ui/ui-components/ui-horizontal-flow/ui-horizontal-flow/ui-horizontal-flow.component';
import { CreditStoresComponent } from '../../../../ui/ui-components/ui-credit/credit-stores/credit-stores.component';
import { IsiranValueComponent } from './components/isiran-value/isiran-value.component';
import { UiBasicSegmentExplanationComponent } from '../../../../ui/ui-components/ui-basic-segment/ui-basic-segment-explanation/ui-basic-segment-explanation.component';
import { IsiranFormComponent } from './components/isiran-form/isiran-form.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-isiran',
  templateUrl: './isiran.component.html',
  styleUrls: ['./isiran.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    IsiranFormComponent,
    UiBasicSegmentExplanationComponent,
    IsiranValueComponent,
    CreditStoresComponent,
    UiHorizontalFlowComponent,
    UiFaqComponent,
  ],
})
export class IsiranComponent implements OnInit {
  isiranPage!: Page<IsiranTemplateData>;

  loaded = false;

  merchants: CreditMerchants;

  sectionFlow: any;

  getCreditExplanation: any;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
    private route: ActivatedRoute,
    private router: Router,
    private merchantService: MerchantsApiService,
  ) {
    this.sectionFlow = ISIRAN_DATA.sectionFlow;
    this.getCreditExplanation = ISIRAN_DATA.getCreditExplanation;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.getPageData(data['prefix'], data['slug']);
    });
  }

  private getPageData(prefix: string, slug: string) {
    this.pageClient.getPage(prefix, slug).subscribe({
      next: (response) => {
        this.isiranPage = response.page;
        this.seo.setGlobalMetaTagsFromPage(response.page);
        this.merchantService.getCreditMerchants().subscribe((res) => {
          this.merchants = res.merchants;
          this.merchants.stores = this.merchants.stores.filter((store) =>
            store.providers.items.some((item) => item.name === 'ملت' || item.name === 'تجارت'),
          );
        });
        of('')
          .pipe(delay(500))
          .subscribe({
            next: () => {
              this.loaded = true;
            },
          });
      },
      error: (error) => {
        let path = this.router.url;
        if (path.slice(-1) === '.') {
          path = path.substring(0, path.length - 1);
        }
        this.router.navigate([path], { skipLocationChange: true });
      },
    });
  }
}
