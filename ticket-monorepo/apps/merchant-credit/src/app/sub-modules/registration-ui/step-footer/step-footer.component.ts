import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'step-footer',
  templateUrl: './step-footer.component.html',
  styleUrls: ['./step-footer.component.scss']
})
export class StepFooterComponent implements OnInit {

  @Input()
  buttonText = 'تایید و ادامه';

  @Input()
  buttonDisabled = false;

  @Output()
  buttonClick = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onButtonClick() {
    this.buttonClick.emit();
  }
}
