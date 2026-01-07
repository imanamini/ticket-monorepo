import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HintComponent, HintOptions } from '../../../../../../../../../components/hint/hint.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { UiButtonComponent } from '../../../../../../../../../components/ui-button/ui-button/ui-button.component';
import {
  InsurtechCollectionImageCdnComponent
} from '../../../../../../../../../components/insurtech-collection-image-cdn/insurtech-collection-image-cdn.component';
import { LeadModel } from '../../../../../../../api/models/lead/lead.model';

@Component({
  selector: 'lead-serial-required',
  templateUrl: './lead-serial-required.component.html',
  styleUrls: ['./lead-serial-required.component.scss'],
  imports: [
    PipesModule,
    UiFormFieldBuilderModule,
    FormsModule,
    UiButtonComponent,
    HintComponent,
    InsurtechCollectionImageCdnComponent
  ],
  standalone: true
})
export class LeadSerialRequiredComponent implements OnInit {

  @Input()
  leadInfo: LeadModel;

  @Output()
  newSerialSubmitted = new EventEmitter();

  serial: string;

  hintOptions: HintOptions = {
    type: 'warning',
    message: '',
    icon: 'orange-info'
  };

  constructor(
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.messageService.showInfoMessage(this.leadInfo.unUsableReasonSerialNumber);
    this.hintOptions.message = `زمان باقی مانده : ${this.leadInfo.durationValue} ${this.leadInfo.durationUnit}`;
  }

  submitted(): void {
    this.newSerialSubmitted.emit(this.serial);
  }
}
