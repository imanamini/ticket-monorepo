import { Component, OnInit } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { WarrantyTemplateData } from '../../../api/clients/models/templates/warranty/warranty-template-data';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { UiSectionPromotionBannerComponent } from '../../../ui/ui-components/ui-banner/ui-section-promotion-banner/ui-section-promotion-banner.component';
import { NgIf } from '@angular/common';
import { WarrantyIntroComponent } from './warranty-intro/warranty-intro.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-warranty',
  templateUrl: './warranty.component.html',
  styleUrls: ['./warranty.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, WarrantyIntroComponent, NgIf, UiSectionPromotionBannerComponent],
})
export class WarrantyComponent implements OnInit {
  warrantyPage!: Page<WarrantyTemplateData>;

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('p', 'warranty').subscribe((res) => {
      this.warrantyPage = res.page;
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
