import { CommonModule, LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, Signal, signal } from '@angular/core';
import { SubscriptionPlan } from '@client-monorepo/common/subscription';
import { ApiImageComponent } from '@digipay/ng-ui-api-image';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { HighlightKeywordsDirective } from '../../../data-access/directives/highlight-keywords.directive';
import { PlanServiceConfigModel } from '../../../data-access/models/plan-service-config.model';
import { generateServiceConfig } from '../../../data-access/utils/plan-service-config';
import { PlanServicesComponent } from '../plan-service/plan-services.component';
import { subscriptionClassMapper } from '../../../data-access/models/subs-class-mapper';

@Component({
  selector: 'digipay-card-applet-subscription-services-bottom-sheet',
  standalone: true,
  imports: [CommonModule, ApiImageComponent, HighlightKeywordsDirective, NgxButtonComponent, PlanServicesComponent, LowerCasePipe],
  templateUrl: './subscription-services-bottom-sheet.component.html',
  styleUrl: './subscription-services-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionServicesBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  plan = signal<SubscriptionPlan | null>(null);
  serviceList = signal<PlanServiceConfigModel[]>([]);
  subscriptionClassMapper = subscriptionClassMapper;

  services: Signal<PlanServiceConfigModel[]> = computed<PlanServiceConfigModel[]>((): PlanServiceConfigModel[] => {
    const generatedServices: PlanServiceConfigModel[] = [];
    this.serviceList()?.map((service, index) => {
      generatedServices[index] = generateServiceConfig(service);
    });
    return generatedServices;
  });
  constructor() {
    effect(
      () => {
        const planData = this.bottomSheetService.data()?.plan as SubscriptionPlan;
        this.plan.set(planData);
        if (planData) {
          const services = planData.services.map((service) => generateServiceConfig(service));
          this.serviceList.set(services);
        }
      },
      { allowSignalWrites: true },
    );
  }
  onClose() {
    this.bottomSheetService.closeBottomSheet();
  }
}
