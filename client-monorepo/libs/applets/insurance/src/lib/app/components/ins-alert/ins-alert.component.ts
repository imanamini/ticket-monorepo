import { Component, effect, input, output } from '@angular/core';
import { NgxAlert, NgxAlertActionButton, NgxAlertActionButtonType } from '@digipay/ngx-alert';

import { AlertActionButtonModel } from '../../data-access/models/alert-action-button.model';
import { AlertColorEnum } from '../../data-access/enums/alert-color.enum';
import { AlertSizeEnum } from '../../data-access/enums/alert-size.enum';

@Component({
  selector: 'ins-alert',
  standalone: true,
  imports: [
    NgxAlert
  ],
  templateUrl: './ins-alert.component.html',
  styleUrl: './ins-alert.component.scss'
})
export class InsAlertComponent {

  constructor() {
    effect(() => {
      if (!this.actionButton()) {
        return;
      }
      this.alertActionButton = {
        [this.actionButton()?.type]: this.actionButton()?.text
      };
    });
  }

  title = input<string>();
  text = input.required<string>();
  icon = input<string>();
  color = input<AlertColorEnum>(AlertColorEnum.Blue);
  size = input<AlertSizeEnum>(AlertSizeEnum.Medium);
  hasIcon = input<boolean>(false);
  hasCloseIcon = input<boolean>(false);
  actionButton = input<AlertActionButtonModel>();

  linkButtonClicked = output<boolean>();
  tintedButtonClicked = output<boolean>();

  alertActionButton: NgxAlertActionButton;

  handleActionButtonClicked(e: NgxAlertActionButtonType): void {
    if (e === 'link') {
      this.linkButtonClicked.emit(true);
    } else {
      this.tintedButtonClicked.emit(true);
    }
  }
}
