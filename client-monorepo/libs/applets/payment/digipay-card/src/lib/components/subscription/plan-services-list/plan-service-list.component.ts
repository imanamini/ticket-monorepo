import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import {  PlanServices } from '@client-monorepo/common/subscription';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgClass } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { HighlightKeywordsDirective } from '../../../data-access/directives/highlight-keywords.directive';
import { generateServiceConfig } from '../../../data-access/utils/plan-service-config';
import { PlanServiceConfigModel } from '../../../data-access/models/plan-service-config.model';

@Component({
  selector: 'digipay-card-applet-plan-service-list',
  templateUrl: './plan-service-list.component.html',
  standalone: true,
  styleUrls: ['./plan-service-list.component.scss'],
  imports: [HighlightKeywordsDirective, ApiImageModule, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanServiceListComponent {
  servicesList = input.required<PlanServices[]>();

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

 
}
