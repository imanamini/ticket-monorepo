import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxButtonComponent} from "@digipay/ngx-button";
import {customGallery} from "../../../api/clients/models/templates/about-us/about-us-template-data";
import {UrlService} from "../../../website/services/url.service";

@Component({
  selector: 'app-custom-gallery',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './custom-gallery.component.html',
  styleUrl: './custom-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomGalleryComponent {


  honors = input<customGallery[]>();
  grayscale = input<boolean>(true);

  constructor(private urlService: UrlService) {
  }


  openLink(link: string): void {
    this.urlService.handleLink(link)
  }


}
