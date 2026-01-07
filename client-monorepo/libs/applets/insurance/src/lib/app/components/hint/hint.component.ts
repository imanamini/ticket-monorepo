import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

export interface HintOptions {
  type: 'warning' | 'info' | 'error' | 'success';
  message: string;
  actions?: { title: string, id: any }[];
  icon?: 'orange-info' | 'green-tick';
}

@Component({
  selector: 'hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor]
})
export class HintComponent implements OnInit {

  @Output()
  actionClicked = new EventEmitter();

  @Input()
  hintOptions: HintOptions;

  constructor() {
  }

  ngOnInit(): void {
  }

  actionClick(val): void {
    this.actionClicked.emit(val.id);
  }
}
