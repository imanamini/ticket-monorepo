import { Component, input, Input, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'ui-progress-bar',
  templateUrl: './ui-progress-bar.component.html',
  styleUrls: ['./ui-progress-bar.component.scss'],
  standalone: true,
  imports: [NgStyle]
})
export class UiProgressBarComponent implements OnInit {

  @Input()
  width = '100%';

  @Input()
  height = 8;

  @Input()
  percent = 40;

  direction = input<'rtl' | 'ltr'>('rtl');

  constructor() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.percent = 80;
    }, 2000);
  }

}
