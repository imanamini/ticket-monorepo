import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-circle-checkmark',
  templateUrl: './ui-circle-checkmark.component.html',
  styleUrls: ['./ui-circle-checkmark.component.scss']
})
export class UiCircleCheckmarkComponent {

  @Input()
  color = 'rgb(0, 64, 255)';

  @Input()
  checkmarkColor = 'white';
}
