import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { UiButtonComponent } from '../ui-button/ui-button/ui-button.component';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'ui-result-action',
  templateUrl: './ui-result-action.component.html',
  styleUrls: ['./ui-result-action.component.scss'],
  standalone: true,
  imports: [CardComponent, UiButtonComponent, NgIf]
})
export class UiResultActionComponent implements OnInit {

  @Input()
  status: 'SUCCESS' | 'FAILED' = 'SUCCESS';

  @Input()
  title = '';

  @Input()
  description = '';

  @Input()
  primaryButtonText = 'متوجه شدم';

  @Input()
  outlineButtonText = '';

  @Output()
  primaryButtonOnClick = new EventEmitter;

  @Output()
  outlineButtonOnClick = new EventEmitter;

  constructor() {
  }

  ngOnInit(): void {
  }

}
