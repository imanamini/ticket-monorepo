import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-form-message',
  templateUrl: './ui-form-message.component.html',
  styleUrls: ['./ui-form-message.component.scss']
})
export class UiFormMessageComponent implements OnInit {

  @Input()
  appearance: 'ERROR' = 'ERROR';

  @Input()
  message!: string;

  constructor() {
  }

  ngOnInit(): void {
  }

}
