import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../../data-access/models/user-rewards.response';
import { CapacityType } from '../../../data-access/models/capacity-type';

@Component({
  selector: 'pay-club-applet-ui-main-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-main-content.component.html',
  styleUrls: ['./ui-main-content.component.scss'],
})
export class UiMainContentComponent {
  @Input()
  data!: Prize;

  capacityType = CapacityType;
}
