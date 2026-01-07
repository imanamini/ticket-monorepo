import { Component, OnInit } from '@angular/core';
import { PageClient } from '../../../../api/clients/page-client';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { CreditClient } from '../../../../api/clients/credit/credit-client';
import { CreditConfigResponse } from '../../../../api/clients/models/templates/credit/credit-config.response';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { DigikalaProductsClient } from '../../../../api/clients/digikala-products-client';
import { BlogCardsComponent } from '../../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { PCreditTypeComponent } from './p-credit-type/p-credit-type.component';
import { PCreditPopularComponent } from './p-credit-popular/p-credit-popular.component';
import { PCreditRegisterComponent } from './p-credit-register/p-credit-register.component';
import { PDigikalaSubCategoryComponent } from './p-digikala-sub-category/p-digikala-sub-category.component';
import { POffersImageComponent } from './p-offers-image/p-offers-image.component';
import { UiDigikalaProductComponent } from '../../../../ui/ui-components/ui-digikala-product/ui-digikala-product.component';
import { SwiperContinuousContentComponent } from '../../../../ui/ui-components/ui-swiper/swiper-continuous-content/swiper-continuous-content.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-product-credit',
  templateUrl: './product-credit.component.html',
  styleUrls: ['./product-credit.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    SwiperContinuousContentComponent,
    UiDigikalaProductComponent,
    POffersImageComponent,
    PDigikalaSubCategoryComponent,
    PCreditRegisterComponent,
    PCreditPopularComponent,
    PCreditTypeComponent,
    UiFaqComponent,
    BlogCardsComponent,
  ],
})
export class ProductCreditComponent implements OnInit {
  templateData: any;

  config!: CreditConfigResponse;

  posts: BlogPost[] = [];

  loaded = false;

  digikalaProducts: any;

  digikalaCategoriesProducts: any;

  productSingle: any;

  constructor(
    private pageClient: PageClient,
    private credit: CreditClient,
    private route: ActivatedRoute,
    private seo: SeoService,
    private router: Router,
    private digikalaProductsService: DigikalaProductsClient,
  ) {}

  ngOnInit(): void {

    const map = this.route.snapshot.params as any;
    if (map.slug) {
      this.credit.getCreditPageConfig().subscribe((config) => {
        this.config = config;
        this.pageClient.getPage('p', 'product-single').subscribe((res) => {
          this.productSingle = res.page.templateData;
        });
        this.pageClient.getCreditProductPage(map.slug).subscribe(
          (res) => {
            this.templateData = res.page.templateData;
            this.posts = res.posts;
            this.seo.setGlobalMetaTagsFromPage(res.page);
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
      });
      this.getDigikalaProducts(map.slug);
    }
  }

  getDigikalaProducts(slug: string) {
    this.digikalaProductsService.getCreditDigikalaProducts('credit', slug).subscribe(
      (res) => {
        if (res.digikalaProducts && res.digikalaProducts.length > 0) {
          this.digikalaProducts = res.digikalaProducts;
        }
        if (res.digikalaCategoriesProducts && res.digikalaCategoriesProducts.length > 0) {
          this.digikalaCategoriesProducts = res.digikalaCategoriesProducts;
        }
      },
      (error) => {
        console.log(error);
      },
    );
  }
}
