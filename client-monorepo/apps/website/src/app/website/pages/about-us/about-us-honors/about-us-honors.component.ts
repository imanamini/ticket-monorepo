import {ChangeDetectionStrategy, Component, Inject, input, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {AboutUsTemplateData} from "../../../../api/clients/models/templates/about-us/about-us-template-data";
import {NgxButtonComponent} from "@digipay/ngx-button";
import {UrlService} from "../../../services/url.service";
import {CustomGalleryComponent} from "../../../../ui/ui-components/ui-custom-gallery/custom-gallery.component";

@Component({
  selector: 'app-about-us-honors',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, CustomGalleryComponent],
  templateUrl: './about-us-honors.component.html',
  styleUrl: './about-us-honors.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsHonorsComponent {


  templateData = input<AboutUsTemplateData | null>();

  constructor( private urlService: UrlService) {
  }

  openLink(link: string): void {
    this.urlService.handleLink(link)
  }
}
