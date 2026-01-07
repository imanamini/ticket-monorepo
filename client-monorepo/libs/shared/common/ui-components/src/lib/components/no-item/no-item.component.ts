import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-ui-components-no-item',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './no-item.component.html',
  styleUrl: './no-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoItemComponent {
  header = input<string | undefined>(undefined);
  description = input<string>('جست‌و‌جوی شما نتیجه‌ای نداشت!');
  imageSrc = input<string>('assets/shared/stores/empty_state.png');
  imageWidth = input<string>('240px');
  buttonTitle = input<string | undefined>(undefined);
  buttonClicked = output<MouseEvent>();

  handleBtnClick(e: MouseEvent): void {
    this.buttonClicked.emit(e);
  }
}
