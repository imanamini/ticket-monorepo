import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { Page } from '../../../api/clients/models/content/page';
import { AboutUsTemplateData } from '../../../api/clients/models/templates/about-us/about-us-template-data';
import { AboutUsMembershipComponent } from './about-us-membership/about-us-membership.component';
import { AboutUsVisionComponent } from './about-us-vision/about-us-vision.component';
import { AboutUsTraitComponent } from './about-us-trait/about-us-trait.component';
import { AboutUsHistoryComponent } from './about-us-history/about-us-history.component';
import { AboutUsIntroComponent } from './about-us-intro/about-us-intro.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';
import {AboutUsAppServicesComponent} from "./about-us-app-services/about-us-app-services.component";
import {AboutUsHonorsComponent} from "./about-us-honors/about-us-honors.component";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    AboutUsIntroComponent,
    AboutUsHistoryComponent,
    AboutUsTraitComponent,
    AboutUsVisionComponent,
    AboutUsMembershipComponent,
    AboutUsAppServicesComponent,
    AboutUsHonorsComponent,
  ],
})
export class AboutUsComponent implements OnInit {
  aboutUsPage!: Page<AboutUsTemplateData>;

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('p', 'about').subscribe((res) => {
      this.aboutUsPage = res.page;
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
