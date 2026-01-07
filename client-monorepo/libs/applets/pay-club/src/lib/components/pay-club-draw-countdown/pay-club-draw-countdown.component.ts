import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../data-access/models/user-rewards.response';
import { UiModernCountdownComponent } from '../ui-components/ui-modern-countdown/ui-modern-countdown.component';

@Component({
  selector: 'pay-club-applet-pay-club-draw-countdown',
  standalone: true,
  imports: [CommonModule, UiModernCountdownComponent],
  templateUrl: './pay-club-draw-countdown.component.html',
  styleUrls: ['./pay-club-draw-countdown.component.scss'],
})
export class PayClubDrawCountdownComponent {
  @Input()
  lottery!: Prize;
}
