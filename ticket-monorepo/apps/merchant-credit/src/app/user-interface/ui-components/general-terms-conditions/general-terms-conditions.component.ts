import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-general-terms-conditions',
  templateUrl: './general-terms-conditions.component.html',
  styleUrls: ['./general-terms-conditions.component.scss']
})
export class GeneralTermsConditionsComponent implements OnInit {

  @Input() tacShow: boolean = false;
  @Output() closed: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClose() {
    this.tacShow = false;
    this.closed.emit(false);
  }

}
