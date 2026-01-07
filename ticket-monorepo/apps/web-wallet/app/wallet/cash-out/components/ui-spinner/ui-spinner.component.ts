import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  templateUrl: './ui-spinner.component.html',
  styleUrls: ['./ui-spinner.component.scss'],
  standalone:true
})
export class UiSpinnerComponent implements OnInit {

  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  size = 24;

  @Input()
  opacity = 0.3;

  constructor() {
  }

  ngOnInit(): void {
  }

}
