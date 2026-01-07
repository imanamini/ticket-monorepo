import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'common-ui-components-progressbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressbarComponent {
  percent = input<number>(0);

  progressStyle = computed(() => {
    return { left: `calc(100% - ${this.percent()}%)` };
  });
}
