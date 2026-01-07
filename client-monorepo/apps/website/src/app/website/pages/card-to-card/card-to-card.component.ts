import { Component, OnInit } from '@angular/core';
import { Page } from '../../../api/clients/models/content/page';
import { CardToCardTemplateData } from '../../../api/clients/models/templates/card-to-card/card-to-card-template-data';
import { SeoService } from '../../services/seo.service';
import { PageClient } from '../../../api/clients/page-client';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiSimilarServicesComponent } from '../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { CardToCardActiveShaparakComponent } from './card-to-card-active-shaparak/card-to-card-active-shaparak.component';
import { CardToCardStepsComponent } from './card-to-card-steps/card-to-card-steps.component';
import { CardToCardTransactionComponent } from './card-to-card-transaction/card-to-card-transaction.component';
import { CardToCardValueComponent } from './card-to-card-value/card-to-card-value.component';
import { CardToCardBanksComponent } from './card-to-card-banks/card-to-card-banks.component';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-card-to-card',
  templateUrl: './card-to-card.component.html',
  styleUrls: ['./card-to-card.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    BaseLayoutComponent,
    CardToCardBanksComponent,
    CardToCardValueComponent,
    CardToCardTransactionComponent,
    CardToCardStepsComponent,
    CardToCardActiveShaparakComponent,
    UiSimilarServicesComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class CardToCardComponent implements OnInit {
  cardToCardPage!: Page<CardToCardTemplateData>;

  loaded = false;

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('services', 'card-to-card').subscribe((res) => {
      this.cardToCardPage = res.page;
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
