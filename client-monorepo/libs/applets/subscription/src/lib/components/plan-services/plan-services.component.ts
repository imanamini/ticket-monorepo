import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  CategorizedListModel,
  PlanServices,
  SERVICES_TAGS_TYPE,
  SERVICES_TYPE,
  SubscriptionPlan,
} from '@client-monorepo/common/subscription';
import { UiPlanServicesComponent } from '../ui-plan-services/ui-plan-services/ui-plan-services.component';
import { noop } from 'rxjs';

@Component({
  selector: 'subscription-applet-plan-services',
  templateUrl: './plan-services.component.html',
  standalone: true,
  imports: [UiPlanServicesComponent],
  styleUrls: ['./plan-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanServicesComponent {
  plan = input.required<SubscriptionPlan>();
  categorizeList = computed<CategorizedListModel[]>((): CategorizedListModel[] => this.categorizeItemsByTags());
  isLoaded = computed(() => this.categorizeList().length > 0);

  categorizeItemsByTags() {
    const tempMap: Partial<Record<SERVICES_TAGS_TYPE, CategorizedListModel>> = {
      [SERVICES_TAGS_TYPE.SPECIAL_OFFERS]: {
        title: this.servicesTagTranslate[SERVICES_TAGS_TYPE.SPECIAL_OFFERS],
        tag: SERVICES_TAGS_TYPE.SPECIAL_OFFERS,
        services: [],
      },
    };
    const services = this.normalizeServices(this.plan()?.services ?? []);
    services.forEach((service: PlanServices) => {
      if (!service.tags) {
        tempMap[SERVICES_TAGS_TYPE.SPECIAL_OFFERS] ? tempMap[SERVICES_TAGS_TYPE.SPECIAL_OFFERS].services.push(service) : noop();
        return;
      }
      const TAGS = Object.keys(SERVICES_TAGS_TYPE) as (keyof typeof SERVICES_TAGS_TYPE)[];
      TAGS.forEach((tag) => {
        const serviceTags = service.tags || [];
        if (!tempMap[tag]) {
          tempMap[tag] = {
            title: this.servicesTagTranslate[tag],
            tag: tag,
            services: [],
          };
        }
        if (serviceTags.includes(tag as SERVICES_TAGS_TYPE)) {
          tempMap[tag] ? tempMap[tag]?.services.push(service) : noop();
        }
      });
    });
    return Object.values(tempMap);
  }
  servicesTagTranslate: Record<SERVICES_TAGS_TYPE, string> = {
    [SERVICES_TAGS_TYPE.SPECIAL_OFFERS]: 'امکانات ویژه',
    [SERVICES_TAGS_TYPE.CASH_OFFERS]: 'هدایای نقدی',
    [SERVICES_TAGS_TYPE.OTHER_OFFERS]: 'سایر امکانات',
  };

  // hardcoded services if plan has no PURCHASE_CASHBACK or DPCARD_ISUUANCE services
  private normalizeServices(services: PlanServices[]): PlanServices[] {
    const result: PlanServices[] = [...services];
    const existingTypes = new Set(result.map((s) => s.type));

    if (!existingTypes.has(SERVICES_TYPE.PURCHASE_CASHBACK)) {
      result.push({
        type: SERVICES_TYPE.F_H_PURCHASE_CASHBACK,
        tags: [SERVICES_TAGS_TYPE.SPECIAL_OFFERS],
      } as PlanServices);
    }

    if (!existingTypes.has(SERVICES_TYPE.DPCARD_ISUUANCE)) {
      result.push({
        type: SERVICES_TYPE.F_H_DPCARD_ISUUANCE,
        tags: [SERVICES_TAGS_TYPE.SPECIAL_OFFERS],
      } as PlanServices);
    }

    return result;
  }
}
