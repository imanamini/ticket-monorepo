import { AfterContentChecked, Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { BlogPost } from '../../../api/clients/models/content/blog-post';
import { Page } from '../../../api/clients/models/content/page';
import { BillTemplateData } from '../../../api/clients/models/templates/bill/bill-template-data';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT, isPlatformBrowser, NgIf } from '@angular/common';
import { UiSimilarServicesComponent } from '../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { BlogCardsComponent } from '../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { BillBenefitComponent } from './bill-benefit/bill-benefit.component';
import { BillBillsComponent } from './bill-bills/bill-bills.component';
import { UiButtonComponent } from '../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiIntroductionDefaultComponent } from '../../../ui/ui-components/ui-introduction-default/ui-introduction-default/ui-introduction-default.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    UiIntroductionDefaultComponent,
    UiButtonComponent,
    BillBillsComponent,
    BillBenefitComponent,
    UiSeoComponent,
    UiFaqComponent,
    BlogCardsComponent,
    UiSimilarServicesComponent,
  ],
})
export class BillComponent implements OnInit, AfterContentChecked {
  billPage!: Page<BillTemplateData>;

  posts: BlogPost[] = [];

  loaded = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) public platformId: string,
    private seo: SeoService,
    private pageClient: PageClient,
    private route: ActivatedRoute,
  ) {}

  @HostListener('window:scroll', []) // for window scroll events
  onScroll() {
    this.reveal();
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.getPageData(data['prefix'], data['slug']);
    });
  }

  ngAfterContentChecked() {
    this.reveal();
  }

  reveal() {
    if (isPlatformBrowser(this.platformId)) {
      const reveals = this.document.querySelectorAll('section');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    }
  }

  private getPageData(prefix: string, slug: string) {
    this.pageClient.getPage(prefix, slug).subscribe((res) => {
      this.billPage = res.page;
      this.posts = res.posts;
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
