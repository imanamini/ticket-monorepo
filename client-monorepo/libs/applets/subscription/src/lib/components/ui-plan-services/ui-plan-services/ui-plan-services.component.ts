import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { PlanServiceConfigModel } from '../models/plan-service-config.model';
import { PlanServiceDetailComponent } from '../plan-service-detail/plan-service-detail.component';
import { generateServiceConfig } from '../generate-service-config';
import { PlanServices } from '@client-monorepo/common/subscription';
import { HighlightKeywordsDirective } from '../../../data-access/directives/highlight-keywords.directive';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgClass } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxBadgeModule } from '@digipay/ngx-badge';

@Component({
  selector: 'subscription-applet-ui-plan-services',
  templateUrl: './ui-plan-services.component.html',
  standalone: true,
  styleUrls: ['./ui-plan-services.component.scss'],
  imports: [HighlightKeywordsDirective, ApiImageModule, NgClass, NgxBadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiPlanServicesComponent {
  servicesList = input.required<PlanServices[]>();

  showDetails = input.required<boolean>();
  title = input<string>('');
  isManagementSection = input<boolean>(false);

  services: Signal<PlanServiceConfigModel[]> = computed<PlanServiceConfigModel[]>((): PlanServiceConfigModel[] => {
    const generatedServices: PlanServiceConfigModel[] = [];
    this.servicesList()?.map((service, index) => {
      generatedServices[index] = generateServiceConfig(service);
    });
    return generatedServices;
  });

  constructor(private bottomSheetService: NgxBottomSheetService) {}

  clickServiceDetail(service: PlanServiceConfigModel): void {
    this.bottomSheetService.openBottomSheet(PlanServiceDetailComponent, {
      detail: service.detail,
    });
  }
}
