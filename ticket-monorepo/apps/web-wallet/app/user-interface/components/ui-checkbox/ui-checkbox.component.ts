import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './ui-checkbox.component.html',
  styleUrls: ['./ui-checkbox.component.scss']
})
export class UiCheckboxComponent {

  @Input()
  title: string;

  @Input()
  checked: boolean;

  @Input()
  logo: string;

  @Input()
  googleAnalyticId: {
    checkboxId: string
  };
}
