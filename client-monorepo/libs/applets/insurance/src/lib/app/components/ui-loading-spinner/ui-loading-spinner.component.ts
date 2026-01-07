import { Component, Input, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'ui-loading-spinner',
  templateUrl: './ui-loading-spinner.component.html',
  styleUrls: ['./ui-loading-spinner.component.scss'],
  standalone: true,
  imports: [NgStyle]
})
export class UiLoadingSpinnerComponent implements OnInit {

  @Input()
  size = 20;

  @Input()
  color = '#0040ff';

  constructor() {
  }

  ngOnInit(): void {
  }

}
