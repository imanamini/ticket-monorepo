import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { IFaqItem } from '../../data-access/models';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.component.html',
  styleUrls: ['./faq-item.component.scss'],
  standalone: true,
  imports: [NgxDividerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqItemComponent {
  data = input<IFaqItem>();
  isLastItem = input<boolean>();
  isExpand = signal<boolean>(false);
  protected readonly BorderColorsEnum = BorderColorsEnum;
}
