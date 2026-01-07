import { PLANS_TYPE } from "@client-monorepo/common/subscription";

  export const subscriptionClassMapper = {
    [PLANS_TYPE.PLATINUM]: 'platinium',
    [PLANS_TYPE.GOLD]: 'gold',
    [PLANS_TYPE.SILVER]: 'silver',
    [PLANS_TYPE.BRONZE]: 'bronze',
    [PLANS_TYPE.BRILLIANCE]: 'brilliance',
    [PLANS_TYPE.DIAMOND]: 'diamond',
    [PLANS_TYPE.TITANIUM]: 'titanium',
    [PLANS_TYPE.PAY_PLUS]: 'pay-plus',
    [PLANS_TYPE.PAY_PRO]: 'pay-pro',
  };