import { Component, OnInit } from '@angular/core';
import { StepBase } from '../../../step-base';

@Component({
  selector: 'account-rules',
  templateUrl: './account-rules.component.html',
  styleUrls: ['./account-rules.component.scss']
})
export class AccountRulesComponent extends StepBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  agree(): void {
    this.nextStep.emit();
  }
}
