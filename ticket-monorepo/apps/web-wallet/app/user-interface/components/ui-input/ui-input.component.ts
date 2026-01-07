import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-input',
  templateUrl: './ui-input.component.html',
  styleUrls: ['./ui-input.component.scss']
})
export class UiInputComponent {

  @Input()
  label: string;

  @Input()
  hintText: string;

  @Input()
  inputId = 'input';

  @Input()
  placeholder: string;
}
