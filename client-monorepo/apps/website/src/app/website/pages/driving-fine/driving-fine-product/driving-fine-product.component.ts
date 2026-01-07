import { Component, Input } from '@angular/core';
import { SectionFineInquiryAndPayment } from '../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { DrivingFineAppletComponent } from '../../../applets/driving-fine-applet/driving-fine-applet/driving-fine-applet.component';

@Component({
  selector: 'app-driving-fine-product',
  templateUrl: './driving-fine-product.component.html',
  styleUrls: ['./driving-fine-product.component.scss'],
  standalone: true,
  imports: [DrivingFineAppletComponent],
})
export class DrivingFineProductComponent {
  @Input() drivingFineInitialData: SectionFineInquiryAndPayment;
}
