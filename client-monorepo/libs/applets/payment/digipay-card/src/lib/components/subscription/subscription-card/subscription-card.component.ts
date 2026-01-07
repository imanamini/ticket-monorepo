import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { generateServiceConfig } from '../../../data-access/utils/plan-service-config';
import { CategorizedListModel, PlanServices, SERVICES_TYPE, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { PlanServiceConfigModel } from '../../../data-access/models/plan-service-config.model';
import { DigiCardIssuanceService } from '../../../data-access/services/digi-card-issuance.service';
import { categorizeServiceItemsByTags } from '../../../data-access/utils/categorize-plan-services';

@Component({
  selector: 'digipay-card-applet-subscription-card',
  standalone: true,
  imports: [CommonModule, NgxRadioButtonComponent, NgxButtonComponent, PipesModule],
  templateUrl: './subscription-card.component.html',
  styleUrl: './subscription-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionCardComponent implements OnInit {
  digiCardIssuanceService = inject(DigiCardIssuanceService);
  ngOnInit(): void {}
  plan = input<SubscriptionPlan | null>();
  isActive = input<boolean>(false);
  title = input<string>('');
  amount = input<number>(0);
  icon = input<string>('');
  onSelectPlan = output<void>();
  servicesList = input<PlanServices[]>([]);
  onOpenDetail = output<void>();
  services: Signal<PlanServiceConfigModel[]> = computed<PlanServiceConfigModel[]>((): PlanServiceConfigModel[] => {
    const generatedServices: PlanServiceConfigModel[] = [];
    this.categorizeList()[0].services?.map((service, index) => {
      generatedServices[index] = generateServiceConfig(service);
    });
    return generatedServices;
  });
  categorizeList = computed<CategorizedListModel[]>((): CategorizedListModel[] => {
    if (this.plan()) {
      return categorizeServiceItemsByTags(this.plan()!);
    }
    return [];
  });
  cashbackService = computed(() => this.services()?.find((s) => s.type === SERVICES_TYPE.PURCHASE_CASHBACK));
}
