import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [NgIf, NgStyle]
})
export class CardComponent implements OnInit {

  @Input()
  cardTitle: string;

  @Input()
  headerIcon: 'close' | 'back' | 'no-icon' = 'close';

  @Input()
  contentSpace = 24;

  @Input()
  hasHeader = true;

  @Output()
  closeEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

}
