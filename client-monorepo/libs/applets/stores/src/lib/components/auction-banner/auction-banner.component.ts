import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stores-applet-auction-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auction-banner.component.html',
  styleUrl: './auction-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuctionBannerComponent {}
