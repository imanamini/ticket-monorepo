import {ChangeDetectionStrategy, Component, Inject, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {BaseLayoutComponent} from "../../../../layout/base-layout/base-layout.component";
import {TapsiIntroComponent} from "../tapsi-intro/tapsi-intro.component";
import {TapsiPropositionComponent} from "../tapsi-proposition/tapsi-proposition.component";
import {UiFaqComponent} from "../../../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component";
import {TapsiCabTemplateData} from "../../../../../api/clients/models/templates/tapsi-cab/tapsi-cab-template-data";
import {PageClient} from "../../../../../api/clients/page-client";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {UrlService} from "../../../../services/url.service";
import {TapsiStepsComponent} from "../tapsi-steps/tapsi-steps.component";
import {SeoService} from "../../../../services/seo.service";

@Component({
  selector: 'app-tapsi-cab',
  standalone: true,
  imports: [CommonModule, BaseLayoutComponent, TapsiIntroComponent, TapsiPropositionComponent, UiFaqComponent, NgxButtonComponent, TapsiStepsComponent],
  templateUrl: './tapsi-cab.component.html',
  styleUrl: './tapsi-cab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TapsiCabComponent implements OnInit {

  loaded = signal(false);
  tapsiCabTemplateData = signal<TapsiCabTemplateData | null>(null);

  private urlService = inject(UrlService);
  private seo = inject(SeoService);

  constructor(@Inject(PLATFORM_ID) private platformId: string) {
  }

  private pageClient = inject(PageClient);

  isMobile = signal(false);

  ngOnInit(): void {
    this.pageClient.getPage('landings', 'tapsi-cab').subscribe((res) => {

      this.tapsiCabTemplateData.set(res.page.templateData);
      this.seo.setGlobalMetaTagsFromPage(res.page);
      this.loaded.set(true);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.isMobile.set(window.innerWidth <= 1280);
    }
  }

  openLink(url: string) {
    this.urlService.handleLink(url)
  }
}
