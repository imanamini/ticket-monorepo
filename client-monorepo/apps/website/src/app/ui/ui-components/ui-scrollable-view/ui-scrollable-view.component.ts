import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-scrollable-view',
  templateUrl: './ui-scrollable-view.component.html',
  styleUrls: ['./ui-scrollable-view.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiScrollableViewComponent {
  withPadding = input(false);

  fullHeightContent = input(false);

  hasFade = input<boolean>();

  fadeColor = input<'white' | 'gray'>('white');
}
