import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ui-button',
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss']
})
export class UiButtonComponent implements OnInit {

  @Input()
  disabled = false;

  @Input()
  appearance: 'DEFAULT' | 'OUTLINE-BLUE' | 'OUTLINE-STEEL' | 'BLUE-TEXT' | 'STEEL-TEXT' | 'FLAT-BLUE' = 'DEFAULT';

  @Output()
  clicked = new EventEmitter();

  @Input()
  link?: string;

  @Input()
  linkTarget: '_blank' | '_self' | '_parent' = '_self';

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick($event: MouseEvent): void {
    this.clicked.emit($event);
  }

}
