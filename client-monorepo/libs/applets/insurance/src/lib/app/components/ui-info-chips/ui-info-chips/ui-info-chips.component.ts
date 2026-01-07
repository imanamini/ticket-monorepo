import { Component, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-info-chips',
  templateUrl: './ui-info-chips.component.html',
  styleUrls: ['./ui-info-chips.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class UiInfoChipsComponent implements OnInit {

  @Input()
  isActive: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
