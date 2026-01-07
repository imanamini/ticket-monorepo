import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'pay-club-applet-ui-content-card',
  standalone: true,
  imports: [CommonModule, DpIconComponent],
  templateUrl: './ui-content-card.component.html',
  styleUrls: ['./ui-content-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiContentCardComponent {
  cardTitle = input<string>();
  hasCardAction = input<boolean>(false);
  cardActionText = input<string>();

  onActionClick = output<void>();
  onCardActionClicked(): void {
    this.onActionClick.emit();
  }
}
