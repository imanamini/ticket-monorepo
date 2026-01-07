export const MerchantsModel: MerchantsModelType = [
  {
    name: 'دیجی‌کالا',
    logo: '/assets/marketing-campaigns/metro-140302/logos/digikala.svg',
  },
  {
    name: 'سفر مارکت',
    logo: '/assets/marketing-campaigns/metro-140302/logos/safarmarket.svg',
  },
  {
    name: 'بانی‌مد',
    logo: '/assets/marketing-campaigns/metro-140302/logos/banimode.svg',
  },
  {
    name: 'دیجی‌لند',
    logo: '/assets/marketing-campaigns/metro-140302/logos/digiland.svg',
  },
  {
    name: 'هماتیت‌گلد',
    logo: '/assets/marketing-campaigns/metro-140302/logos/hematit.svg',
  },
  {
    name: 'دیجی‌کالاجت',
    logo: '/assets/marketing-campaigns/metro-140302/logos/jet.svg',
  },
  {
    name: 'موبایل ۱۴۰',
    logo: '/assets/marketing-campaigns/metro-140302/logos/mob140.svg',
  },
  {
    name: 'کیا گالری',
    logo: '/assets/marketing-campaigns/metro-140302/logos/kiagallery.svg',
  },
  {
    name: 'نورا',
    logo: '/assets/marketing-campaigns/metro-140302/logos/noura.svg',
  },
  {
    name: 'تاج‌گلد',
    logo: '/assets/marketing-campaigns/metro-140302/logos/tajgold.svg',
  },
  {
    name: 'کارناوال',
    logo: '/assets/marketing-campaigns/metro-140302/logos/karnaval.svg',
  },
  {
    name: 'ایران تایمر',
    logo: '/assets/marketing-campaigns/metro-140302/logos/timer.svg',
  },
];

export type MerchantsModelType = Merchant[];

export interface Merchant {
  name: string;
  logo: string;
  src?: string;
}
