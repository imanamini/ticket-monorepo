import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeeInitResponse } from '../../../api/clients/early-settlement/response-models/fee-init.response';

@Component({
  selector: 'app-early-settlement-success-result',
  templateUrl: './early-settlement-success-result.component.html',
  styleUrls: ['./early-settlement-success-result.component.scss']
})
export class EarlySettlementSuccessResultComponent implements OnInit {

  @Input() successResultData?: FeeInitResponse;
  @Output() nextStep = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    this.nextStep.emit();
  }
}
