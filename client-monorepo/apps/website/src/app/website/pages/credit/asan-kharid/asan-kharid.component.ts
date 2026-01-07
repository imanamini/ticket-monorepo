import { Component, OnInit } from '@angular/core';
import { PageClient } from '../../../../api/clients/page-client';
import { Page } from '../../../../api/clients/models/content/page';
import { AsanKharidTemplateData } from '../../../../api/clients/models/templates/asan-kharid/asan-kharid-template-data';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { ActivatedRoute, Router } from '@angular/router';
import { FaqItem } from '../../../../api/clients/models/templates/services/faq';
import { DigikalaProductsClient } from '../../../../api/clients/digikala-products-client';
import { CreditConfigResponse } from '../../../../api/clients/models/templates/credit/credit-config.response';
import { PageDataService } from '../../../services/page-data.service';
import { CreditClient } from '../../../../api/clients/credit/credit-client';
import { BlogCardsComponent } from '../../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiSimilarServicesComponent } from '../../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { AsanKharidProductListComponent } from './asan-kharid-product-list/asan-kharid-product-list.component';
import { CreditDigikalaProductsComponent } from '../../../../ui/ui-components/ui-credit/credit-digikala-products/credit-digikala-products.component';
import { UiBasicSegmentComponent } from '../../../../ui/ui-components/ui-basic-segment/ui-basic-segment/ui-basic-segment.component';
import { UiFlowComponent } from '../../../../ui/ui-components/ui-flow/ui-flow/ui-flow.component';
import { UiTimelineComponent } from '../../../../ui/ui-components/ui-timeline/ui-timeline/ui-timeline.component';
import { ScrollToAnchorDirective } from '../../../../ui/ui-directive/scroll-to-anchor.directive';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-asan-kharid',
  templateUrl: './asan-kharid.component.html',
  styleUrls: ['./asan-kharid.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    ScrollToAnchorDirective,
    NgOptimizedImage,
    UiTimelineComponent,
    UiFlowComponent,
    UiBasicSegmentComponent,
    CreditDigikalaProductsComponent,
    AsanKharidProductListComponent,
    UiFaqComponent,
    UiSimilarServicesComponent,
    BlogCardsComponent,
  ],
})
export class AsanKharidComponent implements OnInit {
  asanKharidPage!: Page<AsanKharidTemplateData>;

  posts: BlogPost[] = [];

  loaded = false;

  digikalaProducts: any;

  faqItems: FaqItem[] = [];

  productSingle;

  creditConfig: CreditConfigResponse;

  constructor(
    private pageClient: PageClient,
    private route: ActivatedRoute,
    private router: Router,
    private digikalaProductsService: DigikalaProductsClient,
    private pageDataService: PageDataService,
    private credit: CreditClient,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.getPageData(data['prefix'], data['slug']);
    });
  }

  getDigikalaProducts(prefix: string, slug: string) {
    this.digikalaProductsService.getCreditDigikalaProducts(prefix, slug).subscribe(
      (res) => {
        if (res.digikalaProducts && res.digikalaProducts.length > 0) {
          this.digikalaProducts = res.digikalaProducts;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }

  getProductSingleModal() {
    this.pageClient.getPage('p', 'product-single').subscribe((res) => {
      this.productSingle = res.page.templateData;
    });
  }

  private getPageData(prefix: string, slug: string) {
    this.pageDataService.getPageData(prefix, slug).subscribe(
      (res) => {
        this.asanKharidPage = res.page;
        this.posts = res.posts;
        if (res.page.templateData.sectionDigikalaProducts && res.page.templateData.sectionDigikalaProducts.tabs.length > 0) {
          this.getDigikalaProducts(prefix, slug);
          this.getProductSingleModal();
          this.credit.getCreditPageConfig().subscribe((creditConfigRes) => {
            this.creditConfig = creditConfigRes;
          });
        }
        of('')
          .pipe(delay(500))
          .subscribe({
            next: () => {
              this.loaded = true;
            },
          });
      },
      () => {
        let path = this.router.url;
        if (path.slice(-1) === '.') {
          path = path.substring(0, path.length - 1);
        }
        this.router.navigate([path], { skipLocationChange: true });
      },
    );
  }
}
