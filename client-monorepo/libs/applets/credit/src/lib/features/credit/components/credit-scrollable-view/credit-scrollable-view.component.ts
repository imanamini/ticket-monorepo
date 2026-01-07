import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-credit-scrollable-view',
  templateUrl: './credit-scrollable-view.component.html',
  styleUrls: ['./credit-scrollable-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScrollableViewComponent {
  withPadding = input(false);

  fullHeightContent = input(false);

  hasFade = input<boolean>();

  fadeColor = input<'white' | 'gray'>('white');
}
