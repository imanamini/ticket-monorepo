import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prize } from '../../../data-access/models/user-rewards.response';
import { DRAW_STATUS_TRANSLATION } from '../../../data-access/models/reward-status';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'pay-club-applet-ui-prize-card',
  standalone: true,
  imports: [CommonModule, ApiImageModule, DpIconComponent],
  templateUrl: './ui-prize-card.component.html',
  styleUrls: ['./ui-prize-card.component.scss'],
})
export class UiPrizeCardComponent {
  @Input()
  prize!: Prize;

  @Output()
  selectCard = new EventEmitter();

  DRAW_STATUS_TRANSLATION = DRAW_STATUS_TRANSLATION;

  selectPrize(): void {
    this.selectCard.emit();
  }
}
