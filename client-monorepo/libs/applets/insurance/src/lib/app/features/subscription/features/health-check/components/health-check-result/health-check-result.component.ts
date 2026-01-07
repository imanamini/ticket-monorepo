import { Component, inject, input } from '@angular/core';
import { JourneyActionResultComponent } from '../../../../../equipment/partials/journey-action-result/journey-action-result.component';
import { JourneyButtonsComponent } from '../../../../../equipment/partials/journey-buttons/journey-buttons.component';
import { AsyncPipe } from '@angular/common';
import { JourneyActionResultDataModel } from '../../../../../equipment/partials/journey-action-result/models/journey-action-result-data.model';
import { Router } from '@angular/router';
import { SUBSCRIPTION_URLS } from '../../../../data-access/constants/subscription-urls';

@Component({
  selector: 'health-check-result',
  templateUrl: './health-check-result.component.html',
  standalone: true,
  imports: [JourneyActionResultComponent, JourneyButtonsComponent, AsyncPipe],
  styleUrls: ['./health-check-result.component.scss'],
})
export class HealthCheckResultComponent {
  uniqueCode = input.required<string>();
  actionResultData: JourneyActionResultDataModel = {
    imageSrc: 'insurance-assets/images/health-check-failed.svg',
    imageAlt: 'Health Check Failed',
    title: 'متاسفانه سلامت‌سنجی دستگاه شما رد شد!',
  };
  private router = inject(Router);

  goToStepper(): void {
    this.router.navigate([SUBSCRIPTION_URLS.HEALTH_CHECK], { queryParams: { id: this.uniqueCode() } });
  }
}
