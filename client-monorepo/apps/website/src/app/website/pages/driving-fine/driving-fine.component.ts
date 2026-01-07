import { Component, OnInit } from '@angular/core';
import { CarFineTemplateData } from '../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { Page } from '../../../api/clients/models/content/page';
import { PageDataService } from '../../services/page-data.service';
import { UiFaqComponent } from '../../../ui/ui-components/ui-faq/ui-faq/ui-faq.component';
import { UiSeoComponent } from '../../../ui/ui-components/ui-seo/ui-seo/ui-seo.component';
import { UiSimilarServicesComponent } from '../../../ui/ui-components/ui-similar-services/ui-similar-services/ui-similar-services.component';
import { UiBasicSegmentExplanationComponent } from '../../../ui/ui-components/ui-basic-segment/ui-basic-segment-explanation/ui-basic-segment-explanation.component';
import { DrivingFinePaymentMethodsComponent } from './driving-fine-payment-methods/driving-fine-payment-methods.component';
import { UiSectionBenefitsComponent } from '../../../ui/ui-components/ui-section-benefits/ui-section-benefits/ui-section-benefits.component';
import { DrivingFineProductComponent } from './driving-fine-product/driving-fine-product.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../layout/base-layout/base-layout.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-driving-fine',
  templateUrl: './driving-fine.component.html',
  styleUrls: ['./driving-fine.component.scss'],
  standalone: true,
  imports: [
    BaseLayoutComponent,
    NgIf,
    DrivingFineProductComponent,
    UiSectionBenefitsComponent,
    DrivingFinePaymentMethodsComponent,
    UiBasicSegmentExplanationComponent,
    UiSimilarServicesComponent,
    UiSeoComponent,
    UiFaqComponent,
  ],
})
export class DrivingFineComponent implements OnInit {
  loaded = false;

  carFineTemplateData: Page<CarFineTemplateData>;

  constructor(private pageDataService: PageDataService) {}

  ngOnInit(): void {
    this.pageDataService.getPageData('services', 'car-fine').subscribe((res) => {
      this.carFineTemplateData = res.page;
      of('')
        .pipe(delay(500))
        .subscribe({
          next: () => {
            this.loaded = true;
          },
        });
    });
  }
}
