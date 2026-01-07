import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-preparing',
  templateUrl: './ui-preparing.component.html',
  styleUrls: ['./ui-preparing.component.scss']
})
export class UiPreparingComponent {

  @Input()
  title: string;

  @Input()
  showSubtitle = true;
}
