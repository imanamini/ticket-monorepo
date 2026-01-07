import { CategorizedListModel, PlanServices, SERVICES_TAGS_TYPE, SubscriptionPlan } from '@client-monorepo/common/subscription';
import { noop } from 'rxjs';

export function categorizeServiceItemsByTags(plan: SubscriptionPlan) {
  const tempMap: Partial<Record<SERVICES_TAGS_TYPE, CategorizedListModel>> = {
    [SERVICES_TAGS_TYPE.SPECIAL_OFFERS]: {
      title: servicesTagTranslate[SERVICES_TAGS_TYPE.SPECIAL_OFFERS],
      tag: SERVICES_TAGS_TYPE.SPECIAL_OFFERS,
      services: [],
    },
  };
  plan.services.forEach((service: PlanServices) => {
    if (!service.tags) {
      tempMap[SERVICES_TAGS_TYPE.SPECIAL_OFFERS] ? tempMap[SERVICES_TAGS_TYPE.SPECIAL_OFFERS].services.push(service) : noop();
      return;
    }
    const TAGS = Object.keys(SERVICES_TAGS_TYPE) as (keyof typeof SERVICES_TAGS_TYPE)[];
    TAGS.forEach((tag) => {
      const serviceTags = service.tags || [];
      if (!tempMap[tag]) {
        tempMap[tag] = {
          title: servicesTagTranslate[tag],
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
export const servicesTagTranslate: Record<SERVICES_TAGS_TYPE, string> = {
  [SERVICES_TAGS_TYPE.SPECIAL_OFFERS]: 'امکانات ویژه',
  [SERVICES_TAGS_TYPE.CASH_OFFERS]: 'هدایای نقدی',
  [SERVICES_TAGS_TYPE.OTHER_OFFERS]: 'سایر امکانات',
};
