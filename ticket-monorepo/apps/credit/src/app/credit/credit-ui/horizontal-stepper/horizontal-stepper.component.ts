import { AfterContentInit, Component, ContentChildren, OnInit, QueryList } from '@angular/core';
import { StepperContentComponent } from './stepper-content/stepper-content.component';

@Component({
  selector: 'app-horizontal-stepper',
  templateUrl: './horizontal-stepper.component.html',
  styleUrls: ['./horizontal-stepper.component.scss']
})
export class HorizontalStepperComponent implements OnInit, AfterContentInit {
  @ContentChildren(StepperContentComponent)
  contents: QueryList<StepperContentComponent>;
  constructor() { }

  ngOnInit() {
  }
  ngAfterContentInit(): void {
    this.contents.forEach((item, index) => {
      item.index = index + 1;
      item.isFirstItem = index === 0;
      item.isLastItem = index === this.contents.length - 1;
    });
  }
}
