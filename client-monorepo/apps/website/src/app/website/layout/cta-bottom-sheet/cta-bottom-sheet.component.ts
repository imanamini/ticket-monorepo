import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxIcon} from "@digipay/ngx-icon";
import {CtaConfig, CtaService} from "./cta.service";
import {UrlService} from "../../services/url.service";
import {NgxButtonComponent} from "@digipay/ngx-button";

@Component({
  selector: 'app-cta-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxIcon, NgxButtonComponent],
  templateUrl: './cta-bottom-sheet.component.html',
  styleUrl: './cta-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBottomSheetComponent {

  readonly cta = input.required<CtaConfig | null>();
  brandButton = input<boolean>(true);
  style = input<string>('fill');
  background = input<string>('#101113d9');
  ctaIcon = input<string>('arrow-2-left');


  private urlService = inject(UrlService);

  openCta(link: string) {
    this.urlService.handleLink(link)
  }
}
