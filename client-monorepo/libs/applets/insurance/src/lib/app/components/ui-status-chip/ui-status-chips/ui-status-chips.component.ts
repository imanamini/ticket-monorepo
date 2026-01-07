import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

export type StatusChipType = 'success' | 'danger' | 'warning' | 'info' | 'active' | 'default';

@Component({
  selector: 'ui-status-chips',
  templateUrl: './ui-status-chips.component.html',
  styleUrls: ['./ui-status-chips.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle]
})
export class UiStatusChipsComponent implements OnInit {

  @Input()
  status: StatusChipType = 'default';

  @Input()
  color: string;

  @Input()
  backgroundColor: string;

  @Input()
  colorized = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
