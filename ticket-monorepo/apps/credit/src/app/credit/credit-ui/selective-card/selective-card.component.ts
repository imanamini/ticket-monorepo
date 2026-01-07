import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-selective-card',
  templateUrl: './selective-card.component.html',
  styleUrls: ['./selective-card.component.scss']
})
export class SelectiveCardComponent implements OnInit {

  @Input()
  disabled: boolean;
  @Input()
  isSelected: boolean;
  @Input()
  color: string;
  @Input()
  logo: string;
  @Input()
  title: string;
  @Input()
  subTitle: string;
  @Input()
  description: string;

  @Output()
  select = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onClick() {
    this.select.emit();
  }
}
