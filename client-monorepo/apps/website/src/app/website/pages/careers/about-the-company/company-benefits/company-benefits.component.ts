import { Component } from '@angular/core';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-company-benefits',
  templateUrl: './company-benefits.component.html',
  styleUrls: ['./company-benefits.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass],
})
export class CompanyBenefitsComponent {
  benefits: {
    title: string;
    icon: string;
  }[] = [
    {
      title: 'برنامه آموزشی',
      icon: 'education',
    },
    {
      title: 'کمک هزینه اینترنت',
      icon: 'internet',
    },
    {
      title: 'امکان دورکاری',
      icon: 'remote-work',
    },
    {
      title: 'امکان خرید اقساطی',
      icon: 'credit',
    },
    {
      title: 'زمان کاری منعطف',
      icon: 'flexible-time',
    },
    {
      title: 'بیمه تکمیلی',
      icon: 'insurance',
    },
    {
      title: 'وعده غذایی',
      icon: 'meal',
    },
    {
      title: 'هدایای مناسبتی',
      icon: 'gift',
    },
  ];
}
