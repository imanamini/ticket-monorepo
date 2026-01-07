import { FrequentServicesIdEnum } from '@client-monorepo/common/service-data';

export const PREMIUM_SERVICES = [
  {
    id: FrequentServicesIdEnum.BNPL,
    title: 'اعتبار',
    icon: 'bnpl',
    primaryColor: '#B291F2',
    secondaryColor: '#884DFF',
  },
  {
    id: FrequentServicesIdEnum.CREDIT,
    title: 'وام',
    icon: 'credit',
    primaryColor: '#B291F2',
    secondaryColor: '#884DFF',
  },
  {
    id: FrequentServicesIdEnum.THIRD_PARTY_INSURANCE,
    title: 'بیمه ثالث',
    icon: 'car-2',
    primaryColor: '#0561E0',
    secondaryColor: '#023A88',
  },
  {
    id: FrequentServicesIdEnum.WEALTH,
    title: 'سرمایه‌گذاری',
    icon: 'chart-three-line',
    primaryColor: '#87E586',
    secondaryColor: '#28BD67',
  },
];
