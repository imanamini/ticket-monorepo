import { Component, OnInit } from '@angular/core';
import { HomeClient } from '../../../api/clients/home-client';
import { BlogPost } from '../../../api/clients/models/content/blog-post';
import { HomeTemplateData } from '../../../api/clients/models/templates/home/home-data.response';
import { Category } from '../../../api/clients/models/content/category';
import { SeoService } from '../../services/seo.service';
import { DownloadSectionData } from '../../../api/clients/models/templates/download/download-data.response';
import { DownloadLinkClient } from '../../../api/clients/download-link-client';
import { BlogCardsComponent } from '../../../ui/ui-components/ui-blog-post-section/blog-cards/blog-cards.component';
import { NgIf } from '@angular/common';
import { HomeDownloadComponent } from './home-download/home-download.component';
import { HomeCustomersComponent } from './home-customers/home-customers.component';
import { HomeBusinessServicesComponent } from './home-business-services/home-business-services.component';
import { HomeIntroductionComponent } from './home-introduction/home-introduction.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    HomeIntroductionComponent,
    HomeBusinessServicesComponent,
    HomeCustomersComponent,
    HomeDownloadComponent,
    NgIf,
    BlogCardsComponent,
  ],
})
export class HomeComponent implements OnInit {
  homeData: HomeTemplateData | null = null;

  posts: BlogPost[] = [];

  categories: Category[] = [];

  downloadApp: DownloadSectionData | undefined = undefined;

  loaded = false;

  constructor(
    private homeClient: HomeClient,
    private seo: SeoService,
    private downloadLinkClient: DownloadLinkClient,
  ) {}

  ngOnInit(): void {
    this.homeClient.getHomePageData().subscribe(
      (res) => {
        this.posts = res.posts;
        this.categories = res.categories;
        this.homeData = res.page.templateData;
        this.seo.setGlobalMetaTagsFromPage(res.page);
        this.downloadLinkClient.getDownloadLinksData().subscribe((res) => {
          this.downloadApp = res.downloadApp;
        });

        of('')
          .pipe(delay(0))
          .subscribe({
            next: () => {
              this.loaded = true;
            },
          });
      },
      (e) => {
        console.log('home error');
        console.log(e);
      },
    );
  }
}
