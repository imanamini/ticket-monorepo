import { Component, input } from '@angular/core';
import { InsuranceInquiry } from '../../../../api/clients/models/templates/insurtech/insurtech-template-data';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';

@Component({
  selector: 'app-insurtech-inquiry',
  templateUrl: './insurtech-inquiry.component.html',
  styleUrls: ['./insurtech-inquiry.component.scss'],
  standalone: true,
  imports: [UiButtonComponent],
})
export class InsurtechInquiryComponent {
  insuranceInquiry = input.required<InsuranceInquiry>();
}
