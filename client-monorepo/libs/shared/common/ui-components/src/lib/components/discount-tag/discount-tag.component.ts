import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxTooltipDirective } from '@digipay/ngx-tooltip';

@Component({
  selector: 'common-ui-components-discount-tag',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxTooltipDirective],
  templateUrl: './discount-tag.component.html',
  styleUrl: './discount-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountTagComponent {
  title = input.required<string>();
  code = input.required<string>();

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.code());
  }
}
