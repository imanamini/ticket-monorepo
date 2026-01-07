import { Component, Input } from '@angular/core';
import { servicesSection } from '../merchant-register-response';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-digipay-services',
  templateUrl: './digipay-services.component.html',
  standalone: true,
  styleUrls: ['./digipay-services.component.scss'],
  imports: [NgForOf],
})
export class DigipayServicesComponent {
  @Input()
  servicesSection!: servicesSection;
}
