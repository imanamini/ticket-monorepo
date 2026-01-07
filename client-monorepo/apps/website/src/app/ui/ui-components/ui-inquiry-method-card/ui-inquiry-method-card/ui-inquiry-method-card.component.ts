import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InquiryMethod, InquiryMethodType } from '../../../../api/digipay/models/driving-fine/inquiry-method';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-inquiry-method-card',
  templateUrl: './ui-inquiry-method-card.component.html',
  styleUrls: ['./ui-inquiry-method-card.component.scss'],
  standalone: true,
  imports: [NgIf, ApiImageModule],
})
export class UiInquiryMethodCardComponent {
  @Input() method: InquiryMethod;

  @Output() clickMethod = new EventEmitter<InquiryMethodType>();

  @Input() selected = false;

  onClickMethod() {
    this.clickMethod.emit(this.method.type);
  }
}
