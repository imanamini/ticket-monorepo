import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {installment} from "../../../../../../../api/clients/models/templates/c-bnpl-v2/CBnplV2Template";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-bnpl-installment-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bnpl-installment-info.component.html',
  styleUrl: './bnpl-installment-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BnplInstallmentInfoComponent {

  flexDirection = input<'flex-row' | 'flex-row-reverse'>('flex-row');
  installmentBnpl = input<installment>();

  constructor(private sanitizer: DomSanitizer) {
  }

  sanitize(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

}
