import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'scrollable-view',
  templateUrl: './scrollable-view.component.html',
  styleUrls: ['./scrollable-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollableViewComponent {
  withPadding = input(false);

  fullHeightContent = input(false);

  hasFade = input<boolean>();

  fadeColor = input<'white' | 'gray'>('white');
}
