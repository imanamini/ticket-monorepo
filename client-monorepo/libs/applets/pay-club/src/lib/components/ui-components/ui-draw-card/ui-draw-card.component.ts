import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../../data-access/models/user-rewards.response';
import { CapacityType } from '../../../data-access/models/capacity-type';
import { UiModernCountdownComponent } from '../ui-modern-countdown/ui-modern-countdown.component';
import { IMAGES_PATH } from '../../../data-access/constants/images-path';

@Component({
  selector: 'pay-club-applet-ui-draw-card',
  standalone: true,
  imports: [CommonModule, UiModernCountdownComponent],
  templateUrl: './ui-draw-card.component.html',
  styleUrls: ['./ui-draw-card.component.scss'],
})
export class UiDrawCardComponent {
  @Input()
  lottery!: Prize;

  IMAGES_PATH = IMAGES_PATH;

  capacityType = CapacityType;
}
