import { Component, input, model, output } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgClass } from '@angular/common';

@Component({
  selector: 'card',
  standalone: true,
  imports: [
    NgxIcon,
    NgClass
  ],
  templateUrl: './claim-card.component.html',
  styleUrl: './claim-card.component.scss'
})
export class ClaimCardComponent {
  // INPUT
  iconName = input<string>('');
  radioButtonPosition = input.required<'right' | 'left'>();
  title = input.required<string>();
  subTitle = input.required<string>();
  isChecked = input.required<boolean>();
  // OUTPUT
  radioButtonClicked = output<boolean>();

  handleChecked(ev?: any): void {
    if (ev?.target?.checked) {
      this.radioButtonClicked.emit(ev.target.checked);
    } else {
      this.radioButtonClicked.emit(!this.isChecked());
    }
  }
}
