import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'pay-club-applet-ui-point-card',
  standalone: true,
  imports: [CommonModule, ApiImageModule, DpIconComponent],
  templateUrl: './ui-point-card.component.html',
  styleUrls: ['./ui-point-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPointCardComponent {
  title = input<string>();

  description = input<string>();

  points = input<string>();

  iconName = input<string>('');

  clicked = output<void>();

  onClick(): void {
    this.clicked.emit();
  }
}
