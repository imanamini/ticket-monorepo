import { Component } from '@angular/core';
import { CompanyBenefitsComponent } from './company-benefits/company-benefits.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-about-the-company',
  templateUrl: './about-the-company.component.html',
  styleUrls: ['./about-the-company.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, CompanyBenefitsComponent],
})
export class AboutTheCompanyComponent {
  selectedTabIndex = 0;
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }
}
