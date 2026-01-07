import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-service-error',
  templateUrl: './no-service-error.component.html',
  styleUrls: ['./no-service-error.component.scss']
})
export class NoServiceErrorComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  @Input() noServiceErrorData: any;
  @Output() onPrimaryClick = new EventEmitter();
  @Output() onASecondaryClick = new EventEmitter();

  onPrimary() {
    this.onPrimaryClick.emit(true);
  }

  onSecondary() {
    this.onASecondaryClick.emit(true);
  }
}
