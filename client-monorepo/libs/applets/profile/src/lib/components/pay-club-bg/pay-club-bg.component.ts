import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'profile-applet-pay-club-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pay-club-bg.component.html',
  styleUrl: './pay-club-bg.component.scss',
})
export class PayClubBgComponent {
  @Input() color = '#9a0fe0';
}
