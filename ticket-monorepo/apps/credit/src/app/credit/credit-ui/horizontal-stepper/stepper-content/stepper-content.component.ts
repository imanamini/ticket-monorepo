import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stepper-content',
  templateUrl: './stepper-content.component.html',
  styleUrls: ['./stepper-content.component.scss']
})
export class StepperContentComponent implements OnInit {

  index: number;
  isFirstItem: boolean;
  isLastItem: boolean;

  constructor() { }

  ngOnInit() {
  }

}
