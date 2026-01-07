import {Component, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {Page} from '../../../api/clients/models/content/page';
import {
  BranchesAddressTemplateData
} from '../../../api/clients/models/templates/branches-address/branches-address-template-data';
import {SeoService} from '../../services/seo.service';
import {PageClient} from '../../../api/clients/page-client';
import {
  UiSectionPromotionBannerComponent
} from '../../../ui/ui-components/ui-banner/ui-section-promotion-banner/ui-section-promotion-banner.component';
import {BranchesAddressIntroComponent} from './branches-address-intro/branches-address-intro.component';
import {isPlatformBrowser, NgClass, NgIf} from '@angular/common';
import {BaseLayoutComponent} from '../../layout/base-layout/base-layout.component';
import {delay, of} from 'rxjs';
import {BranchesHeaderComponent} from "./branches-header/branchesHeader.component";
import {LoanGuideComponent} from "./loan-guide/loanGuide.component";
import {blackFridayTemplateData} from "../../../api/clients/models/templates/black-friday/black-friday-template-data";
import {UiFaqComponent} from "../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component";
import {UiSeoComponent} from "../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component";

@Component({
  selector: 'app-branches-address',
  templateUrl: './branches-address.component.html',
  styleUrls: ['./branches-address.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, NgIf, BranchesAddressIntroComponent, UiSectionPromotionBannerComponent, BranchesHeaderComponent, LoanGuideComponent, UiFaqComponent, UiSeoComponent, NgClass],
})
export class BranchesAddressComponent implements OnInit {

  branchesPage = signal<BranchesAddressTemplateData | null>(null);
  mobileMode = signal(false);

  loaded = false;


  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
    @Inject(PLATFORM_ID) public platformId: string,
  ) {
  }

  ngOnInit(): void {
    this.pageClient.getPage('p', 'branches').subscribe((res) => {
      this.branchesPage.set(res.page.templateData);
      this.seo.setGlobalMetaTagsFromPage(res.page);
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });

    if (isPlatformBrowser(this.platformId)) {
      this.mobileMode.set(window.innerWidth <= 1280);
    }
  }
}
