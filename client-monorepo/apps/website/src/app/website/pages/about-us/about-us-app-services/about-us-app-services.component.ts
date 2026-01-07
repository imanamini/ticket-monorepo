import {ChangeDetectionStrategy, Component, Inject, input, Input, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {AboutUsTemplateData} from "../../../../api/clients/models/templates/about-us/about-us-template-data";
import {SwiperDirective} from "../../../../ui/ui-directive/swiper.directive";
import {SwiperOptions} from "swiper/types";
import {UrlService} from "../../../services/url.service";

@Component({
  selector: 'app-about-us-app-services',
  standalone: true,
  imports: [CommonModule, SwiperDirective],
  templateUrl: './about-us-app-services.component.html',
  styleUrl: './about-us-app-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsAppServicesComponent implements OnInit {

  templateData = input<AboutUsTemplateData | null>();
  readonly itemsPerRow = 9; // 27 / 3

  appServices = signal<any[][]>([]);

  constructor(@Inject(PLATFORM_ID) public platformId: string , private urlService: UrlService ) {
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const items = this.templateData()?.appServices?.services ?? [];
      const screenWidth = window.innerWidth;

      let totalRows = 3;

      if (screenWidth < 768) {
        totalRows = Math.ceil(items.length / 3); // 3 items per row
      } else if (screenWidth < 1200) {
        totalRows = Math.ceil(items.length / 6); // 6 items per row
      } else {
        totalRows = 3; // default
      }

      const itemsPerRow = Math.ceil(items.length / totalRows);
      const rows = [];

      for (let i = 0; i < totalRows; i++) {
        rows.push(items.slice(i * itemsPerRow, (i + 1) * itemsPerRow));
      }

      this.appServices.set(rows);
    }


  }

  openLink(link: string): void {
    this.urlService.handleLink(link)
  }

}
