import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { RouterLink } from '@angular/router';
import { AnimatedListComponent } from '@client-monorepo/common/ui-components';
import { AnimatedListDirective } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'stores-applet-shopping-guide-promotion',
  standalone: true,
  imports: [CommonModule, NgxIcon, RouterLink, AnimatedListComponent, AnimatedListDirective],
  templateUrl: './shopping-guide-promotion.component.html',
  styleUrl: './shopping-guide-promotion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingGuidePromotionComponent {
  text = input.required<string>();
  linkToGo = input.required<string>();
  icons = input<string[]>(['bank-card-2', 'barcode-scan', 'qr-scan']);
}
