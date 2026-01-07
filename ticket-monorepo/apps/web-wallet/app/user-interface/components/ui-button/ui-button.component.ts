import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent {

  @Output()
  buttonClick = new EventEmitter();

  @Input()
  appearance: 'default' | 'outline' | 'clean' | 'green' | 'blue-text' | 'outline-light-blue' | 'light-blue' | 'red-text' | 'primary-blue' = 'default';

  @Input()
  theme: 'wallet' | 'digipay' = 'wallet';

  @Input()
  disabled = false;

  @Input()
  fullWidth = false;

  @Input()
  styles = {};

  @Input()
  size: 'normal' | 'small' = 'normal';

  @Input()
  hasIcon = false;

  @Input()
  googleAnalyticId: {
    buttonId: string
  };

  clicked($event) {
    this.buttonClick.emit($event);
  }

  get className() {
    return this.appearance +
      (this.fullWidth ? ' is-full-width ' : '') +
      (this.theme !== 'wallet' ? ` ${this.theme}-theme ` : '') +
      (this.hasIcon ? 'has-icon ' : '') +
      (this.size === 'small' ? ' small-button' : '');
  }
}
