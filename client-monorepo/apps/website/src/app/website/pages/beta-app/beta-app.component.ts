import { Component, OnInit } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { BetaAppTemplate } from '../../../api/clients/models/templates/beta-app/beta-app-template';
import { PageClient } from '../../../api/clients/page-client';
import { SeoService } from '../../services/seo.service';
import { BetaAppFeaturesComponent } from './beta-app-features/beta-app-features.component';
import { BetaAppIntroductionComponent } from './beta-app-introduction/beta-app-introduction.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-beta-app',
  templateUrl: './beta-app.component.html',
  styleUrls: ['./beta-app.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, BetaAppIntroductionComponent, BetaAppFeaturesComponent],
})
export class BetaAppComponent implements OnInit {
  betaAppPage!: Page<BetaAppTemplate>;

  loaded = false;

  constructor(
    private pageClient: PageClient,
    private seo: SeoService,
  ) {}

  ngOnInit(): void {
    this.getPageData('p', 'betaapp');
  }

  private getPageData(prefix: string, slug: string) {
    this.pageClient.getPage(prefix, slug).subscribe((res) => {
      this.betaAppPage = res.page;
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
