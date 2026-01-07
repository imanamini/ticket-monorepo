import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[ui-icon]',
  templateUrl: './ui-icon.component.html',
  styleUrls: ['./ui-icon.component.scss']
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
