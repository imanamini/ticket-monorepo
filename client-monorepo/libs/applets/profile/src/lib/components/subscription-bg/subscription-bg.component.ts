import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'profile-applet-subscription-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-bg.component.html',
  styleUrl: './subscription-bg.component.scss',
})
export class SubscriptionBgComponent {
  @Input() bgColor = '#9a0fe0';
}
