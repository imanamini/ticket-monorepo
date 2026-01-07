import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  GetSettlementDetailTransformedResponse
} from '../../../api/clients/early-settlement/response-models/get-settlement-detail.response';

@Component({
  selector: 'app-early-settlement-status-page',
  templateUrl: './early-settlement-status-page.component.html',
  styleUrls: ['./early-settlement-status-page.component.scss']
})
export class EarlySettlementStatusPageComponent implements OnInit {

  @Input()
  detail?: GetSettlementDetailTransformedResponse;
  @Input()
  trackingCode: string = '';
  @Input()
  inBoxMode: boolean = false;
  @Output()
  back = new EventEmitter();
  warningMessage: string = '';
  canCancel: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    if (!this.detail) {
      return;
    }
  }

  onBack() {
    this.back.emit();
  }
}
