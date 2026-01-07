import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-form-notice',
  templateUrl: './text-field-notice.component.html',
  styleUrls: ['./text-field-notice.component.scss']
})
export class FormNoticeComponent implements OnInit {

  @Input()
  visible: boolean = false;

  @Input()
  appearance: 'error' | 'hint';

  constructor() {
  }

  ngOnInit() {
  }

}
