import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../../data-access/models/user-rewards.response';
import { IMAGES_PATH, ImagesPathInterface } from '../../../data-access/constants/images-path';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'pay-club-applet-ui-ticket-card',
  standalone: true,
  imports: [CommonModule, NgxBadgeModule, DpIconComponent],
  templateUrl: './ui-ticket-card.component.html',
  styleUrls: ['./ui-ticket-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiTicketCardComponent {
  IMAGES_PATH: ImagesPathInterface = IMAGES_PATH;
  voucher = input<Prize>();
  ticketClasses = input<string>('surface-high-contrast');
  width = input<string>('250px');
  height = input<string>('168px');
}
