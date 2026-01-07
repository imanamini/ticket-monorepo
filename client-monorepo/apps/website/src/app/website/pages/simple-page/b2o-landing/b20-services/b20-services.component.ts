import { Component, Input } from '@angular/core';
import { digipayServicesSection } from '../B2O-landing.response';
import { ServiceItemComponent } from './service-item/service-item.component';

@Component({
  selector: 'app-b20-services',
  standalone: true,
  templateUrl: './b20-services.component.html',
  styleUrls: ['./b20-services.component.scss'],
  imports: [ServiceItemComponent],
})
export class B20ServicesComponent {
  @Input() b2eServices!: digipayServicesSection;
}
