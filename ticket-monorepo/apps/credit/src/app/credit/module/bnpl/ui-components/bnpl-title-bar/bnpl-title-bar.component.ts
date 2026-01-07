import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bnpl-title-bar',
  templateUrl: './bnpl-title-bar.component.html',
  styleUrls: ['./bnpl-title-bar.component.scss']
})
export class BnplTitleBarComponent implements OnInit {

  @Input()
  hideClose: boolean;

  @Output()
  close = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }
}
