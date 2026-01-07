import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CreditDigipayImageComponent } from '../credit-digipay-image/credit-digipay-image.component';
import { NgCircleProgressModule } from 'ng-circle-progress';

@Component({
  selector: 'app-credit-score-circle',
  templateUrl: './credit-score-circle.component.html',
  styleUrls: ['./credit-score-circle.component.scss'],
  standalone: true,
  imports: [CreditDigipayImageComponent, NgCircleProgressModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditScoreCircleComponent {
  fillColor = input<string>();

  color = input<string>();

  icon = input<'warning' | 'success'>();

  imageId = input<string>();

  percent = input<number>();

  score = input<string>();

  subtitle = input<string>();
}
