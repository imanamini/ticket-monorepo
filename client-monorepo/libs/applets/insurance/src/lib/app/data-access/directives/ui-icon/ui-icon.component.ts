import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: '[ui-icon]',
  templateUrl: './ui-icon.component.html',
  styleUrls: ['./ui-icon.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle]
})
export class UiIconComponent implements OnInit {
  @Input()
  icon: string;

  @Input()
  size = 16;

  constructor() {
  }

  ngOnInit(): void {
  }
}
