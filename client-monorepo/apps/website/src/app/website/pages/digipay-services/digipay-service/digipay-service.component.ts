import { Component, OnInit } from '@angular/core';
import { PageClient } from '../../../../api/clients/page-client';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { ServicePageTemplate } from '../../../../api/clients/models/templates/services/service-page-template';
import { BlogPost } from '../../../../api/clients/models/content/blog-post';
import { BlogCardsComponent } from '../../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { UiSimilarServicesComponent } from '../../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { UiFaqComponent } from '../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiFlowComponent } from '../../../../ui/ui-components/ui-flow/ui-flow/ui-flow.component';
import { UiValueSectionComponent } from '../../../../ui/ui-components/ui-value-cards/ui-value-section/ui-value-section.component';
import { NgIf } from '@angular/common';
import { DpServiceIntroComponent } from './dp-service-intro/dp-service-intro.component';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-digipay-service',
  templateUrl: './digipay-service.component.html',
  styleUrls: ['./digipay-service.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    DpServiceIntroComponent,
    NgIf,
    UiValueSectionComponent,
    UiFlowComponent,
    UiFaqComponent,
    UiSimilarServicesComponent,
    BlogCardsComponent,
  ],
})
export class DigipayServiceComponent implements OnInit {
  templateData: null | ServicePageTemplate = null;

  posts: BlogPost[] = [];

  loaded = false;

  constructor(
    private pageClient: PageClient,
    private route: ActivatedRoute,
    private seo: SeoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const map = this.route.snapshot.params as any;
    if (map.slug) {
      this.pageClient.getServicePage(map.slug).subscribe(
        (res) => {
          this.posts = res.posts;
          this.templateData = res.page.templateData;
          this.seo.setGlobalMetaTagsFromPage(res.page);
          of('')
            .pipe(delay(500))
            .subscribe({
              next: () => {
                this.loaded = true;
              },
            });
        },
        (error) => {
          let path = this.router.url;
          if (path.slice(-1) === '.') {
            path = path.substring(0, path.length - 1);
          }
          this.router.navigate([path], { skipLocationChange: true });
        },
      );
    }
  }
}
