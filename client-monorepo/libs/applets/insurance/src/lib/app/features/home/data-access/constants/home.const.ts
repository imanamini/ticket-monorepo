import { AlertColorEnum } from '../../../../data-access/enums/alert-color.enum';
import { BadgeStatusEnum } from '../../../../data-access/enums/badge-status.enum';
import { BannerModel } from '../../../../data-access/models/banner.model';
import { BusinessValueModel } from '../../../../data-access/models/business-value.model';
import { InsCarouselListItemModel } from '../../../../data-access/models/ins-carousel-list-item.model';
import { InsuranceProductModel } from '../models/insurance-product.model';

export enum InsuranceProductsEnum {
  BODY = 'body',
  THIRD_PARTY = 'third_party',
  USED = 'used',
  House = 'house',
  THIRD_PARTY_MOTOR = 'third_party_motor',
  Floki = 'floki',
}

export const ProductToUrlMapper: Record<InsuranceProductsEnum, string> = {
  [InsuranceProductsEnum.BODY]: 'vehicle/body',
  [InsuranceProductsEnum.THIRD_PARTY]: 'vehicle/third-party',
  [InsuranceProductsEnum.USED]: 'equipment/used',
  [InsuranceProductsEnum.House]: 'house-incidents',
  [InsuranceProductsEnum.THIRD_PARTY_MOTOR]: 'vehicle/third-party-motor',
  [InsuranceProductsEnum.Floki]: 'application-form',
};

export const InsuranceProducts: InsuranceProductModel[] = [
  {
    title: 'بیمه شخص ثالث',
    logo: 'insurance-assets/images/home/third-party-logo.png',
    url: ProductToUrlMapper[InsuranceProductsEnum.THIRD_PARTY],
    badge: {
      text: 'خرید اعتباری',
      status: BadgeStatusEnum.Info,
    },
    type: InsuranceProductsEnum.THIRD_PARTY,
  },
  {
    title: 'بیمه موتورسیکلت',
    logo: 'insurance-assets/images/home/third-party-motor.png',
    url: ProductToUrlMapper[InsuranceProductsEnum.THIRD_PARTY_MOTOR],
    badge: {
      text: 'خرید اعتباری',
      status: BadgeStatusEnum.Info,
    },
    type: InsuranceProductsEnum.THIRD_PARTY_MOTOR,
  },
  {
    title: 'بیمه بدنه',
    logo: 'insurance-assets/images/home/body-logo.png',
    url: ProductToUrlMapper[InsuranceProductsEnum.BODY],
    badge: {
      text: 'خرید اعتباری',
      status: BadgeStatusEnum.Info,
    },
    type: InsuranceProductsEnum.BODY,
  },
  {
    title: 'بیمه خانه',
    logo: 'insurance-assets/images/home/house-incident.png',
    url: ProductToUrlMapper[InsuranceProductsEnum.House],
    badge: {
      text: 'ویژه جنگ و بمباران',
      status: BadgeStatusEnum.Warning,
    },
    type: InsuranceProductsEnum.House,
  },
  {
    title: 'موبایل و تبلت',
    logo: 'insurance-assets/images/home/phone-logo.png',
    url: ProductToUrlMapper[InsuranceProductsEnum.USED],
    badge: {
      text: '۸۰٪ تخفیف',
      status: BadgeStatusEnum.Error,
    },
    type: InsuranceProductsEnum.USED,
  },
  {
    title: 'تجهیزات جدید',
    logo: 'insurance-assets/images/home/phone-logo.png',
    url: ProductToUrlMapper[InsuranceProductsEnum.Floki],
    badge: {
      text: '۸۰٪ تخفیف',
      status: BadgeStatusEnum.Error,
    },
    type: InsuranceProductsEnum.Floki,
  },
];

export const BusinessValueItems: BusinessValueModel[] = [
  {
    text: 'امکان پرداخت اقساطی بیمه‌شخص ثالث خودرو برای خرید از تمام شرکت‌های بیمه‌گر فراهم است. با تغییر شرکت بیمه، تخفیف‌های بیمه‌نامه به شرکت جدید منتقل می‌شوند.',
    icon: 'car',
    color: AlertColorEnum.Blue,
  },
  {
    text: 'پوشش ۱۰۰٪ برای خسارت‌های جزئی، شامل تعمیر و گارانتی دستگاه در دیجی‌کالا سرویس، به همراه جبران سرقت و پرداخت آنلاین خسارت در ۴۸ ساعت برای تجهیزات دیجیتال',
    icon: 'mobile',
    color: AlertColorEnum.Green,
  },
];

export const Insurers: InsCarouselListItemModel[][] = [
  [
    {
      title: 'ایران',
      icon: 'insurer-logo_Iran',
    },
    {
      title: 'تجارت نو',
      icon: 'insurer-logo_Tejarateno',
    },
    {
      title: 'تعاون',
      icon: 'insurer-logo_Taavon',
    },
    {
      title: 'سینا',
      icon: 'insurer-logo_Sina',
    },
    {
      title: 'رازی',
      icon: 'insurer-logo_Razi',
    },
    {
      title: 'آسیا',
      icon: 'insurer-logo_Asia',
    },
    {
      title: 'پارسیان',
      icon: 'insurer-logo_Parsian',
    },
    {
      title: 'دی',
      icon: 'insurer-logo_Day',
    },
  ],
  [
    {
      title: 'پاسارگاد',
      icon: 'insurer-logo_PASARGAD',
    },
    {
      title: 'البرز',
      icon: 'insurer-logo_Alborz',
    },
    {
      title: 'سامان',
      icon: 'insurer-logo_Saman',
    },
    {
      title: 'دانا',
      icon: 'insurer-logo_Dana',
    },
    {
      title: 'کوثر',
      icon: 'insurer-logo_Kowsar',
    },
    {
      title: 'ملت',
      icon: 'insurer-logo_Mellat',
    },
    {
      title: 'معلم',
      icon: 'insurer-logo_Moallem',
    },
    {
      title: 'میهن',
      icon: 'insurer-logo_Mihan',
    },
  ],
  [
    {
      title: 'آرمان',
      icon: 'insurer-logo_Arman',
    },
    {
      title: 'سرمد',
      icon: 'insurer-logo_Sarmad',
    },
    {
      title: 'کارآفرین',
      icon: 'insurer-logo_Karafarin',
    },
    {
      title: 'ما',
      icon: 'insurer-logo_Ma',
    },
    {
      title: 'نوین',
      icon: 'insurer-logo_Novin',
    },
    {
      title: 'آسماری',
      icon: 'insurer-logo_Asmari',
    },
    {
      title: 'حکمت',
      icon: 'insurer-logo_Hekmat',
    },
    {
      title: 'حافظ',
      icon: 'insurer-logo_Hafez',
    },
  ],
  [
    {
      title: 'آتیه سازان حافظ',
      icon: 'insurer-logo_Atieh_sazan_hafez',
    },
  ],
];

export const MainBanners: BannerModel[] = [
  {
    id: 1,
    src: 'insurance-assets/images/home-main-banner.png',
    alt: 'third-party-marketing',
    actionUrl: ['vehicle', 'third-party'],
  },
  {
    id: 2,
    src: 'insurance-assets/images/home-marketing-banner.png',
    alt: 'equipment-marketing',
    actionUrl: ['equipment', 'used'],
  },
];
