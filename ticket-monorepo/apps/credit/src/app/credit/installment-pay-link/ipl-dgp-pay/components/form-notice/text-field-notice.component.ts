import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-dpg-form-notice',
  templateUrl: './text-field-notice.component.html',
  styleUrls: ['./text-field-notice.component.scss']
})
export class DpgFormNoticeComponent implements OnInit {

  @Input()
  visible = false;

  @Input()
  appearance: 'error' | 'hint';

  constructor() {
  }

  ngOnInit() {
  }

}
