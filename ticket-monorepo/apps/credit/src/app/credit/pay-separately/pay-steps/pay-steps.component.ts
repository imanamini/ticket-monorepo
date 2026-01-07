import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PayStep } from '../services/pay-step.interface';

@Component({
  selector: 'app-pay-steps',
  templateUrl: './pay-steps.component.html',
  styleUrls: ['./pay-steps.component.scss']
})
export class PayStepsComponent {

  @Input() steps: PayStep[] = [];

  constructor() { }
}
