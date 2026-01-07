import { StoreCategory, StoreCategoryTitle } from '../models/store.type';

export const storeCategories: StoreCategory[] = [
  {
    id: 1,
    title: StoreCategoryTitle.DIGITAL,
    subtitle: 'موبایل، لپ‌تاپ و تجهیزات الکترونیک',
    image: 'assets/stores/store-categories/Digital.png',
  },
  {
    id: 2,
    title: StoreCategoryTitle.BEAUTY_AND_HEALTH,
    subtitle: 'سالن و کلینیک زیبایی، مراکز تندرستی',
    image: 'assets/stores/store-categories/Beauty.png',
  },

  {
    id: 3,
    title: StoreCategoryTitle.FASHION_AND_CLOTHING,
    subtitle: 'پوشاک و اکسسوری آقایان و بانوان',
    image: 'assets/stores/store-categories/Fashion.png',
  },
  {
    id: 4,
    title: StoreCategoryTitle.GOLD_AND_COINS,
    subtitle: 'طلا و جواهر، نقره،‌ سکه و شمش',
    image: 'assets/stores/store-categories/Jewelry.png',
  },
  {
    id: 5,
    title: StoreCategoryTitle.HOME_AND_KITCHEN,
    subtitle: 'لوازم خانگی برقی، مبلمان و دکوراسیون',
    image: 'assets/stores/store-categories/HomeandKitchen.png',
  },
  {
    id: 6,
    title: StoreCategoryTitle.ENTERTAINMENT_AND_TOURISM,
    subtitle: 'تورهای گردشگری، هتل و اقامتگاه',
    image: 'assets/stores/store-categories/Travel.png',
  },
  {
    id: 7,
    title: StoreCategoryTitle.SPORTS_AND_TRAVEL,
    subtitle: 'شهربازی و اماکن تفریحی و فرهنگی',
    image: 'assets/stores/store-categories/Entertainment.png',
  },

  {
    id: 8,
    title: StoreCategoryTitle.BOOKS_STATIONERY,
    subtitle: 'کتاب، انتشارات،‌ نوشت‌افزار',
    image: 'assets/stores/store-categories/Books.png',
  },
  {
    id: 9,
    title: StoreCategoryTitle.EDUCATION_AND_ENTERTAINMENT,
    subtitle: 'زبان، موسیقی، آشپزی، هنر، فنی',
    image: 'assets/stores/store-categories/Learning.png',
  },
  {
    id: 10,
    title: StoreCategoryTitle.HOUSEHOLD_CONSUMER,
    subtitle: 'سوپرمارکت،‌ پروتئینی،‌ میوه و سبزیجات',
    image: 'assets/stores/store-categories/EssentialGoods.png',
  },
  {
    id: 11,
    title: StoreCategoryTitle.CARS_AND_MOTORCYCLES,
    subtitle: 'خودرو و موتورسیکلت و لوازم جانبی',
    image: 'assets/stores/store-categories/Vehicle.png',
  },
  {
    id: 12,
    title: StoreCategoryTitle.BIRTHDAY_GIFTS_AND_ACCESSORIES,
    subtitle: 'اقلام کادویی، تم تولد و لوازم شیرینی',
    image: 'assets/stores/store-categories/Birthday-Stuff.png',
  },
  {
    id: 14,
    title: StoreCategoryTitle.TOYS_FOR_CHILDREN_AND_BABIES,
    subtitle: 'اسباب‌بازی،‌ پوشاک نوزاد و سیسمونی',
    image: 'assets/stores/store-categories/KidsStuff.png',
  },
  {
    id: 15,
    title: StoreCategoryTitle.BUILDING_TOOLS_AND_INDUSTRIAL_EQUIPMENT,
    subtitle: 'ابزارآلات و مصالح ساختمانی و صنعتی',
    image: 'assets/stores/store-categories/Equipments.png',
  },
  {
    id: 16,
    title: StoreCategoryTitle.MEDICINE_AND_TREATMENT,
    subtitle: 'مشاوره پزشکی، زیبایی و فیشال،‌ ماساژ',
    image: 'assets/stores/store-categories/Healthcare.png',
  },
  {
    id: 17,
    title: StoreCategoryTitle.SERVICES,
    subtitle: 'تعمیرات و خدمات منزل،‌ کارواش',
    image: 'assets/stores/store-categories/Service.png',
  },
  {
    id: 18,
    title: StoreCategoryTitle.PETS,
    subtitle: 'پت‌شاپ، آکواریوم،‌ کلینیک دامپزشکی',
    image: 'assets/stores/store-categories/Petshop.png',
  },
  {
    id: 19,
    title: StoreCategoryTitle.FLOWER_AND_PLANTS,
    subtitle: 'گل‌فروشی و لوازم کشاورزی',
    image: 'assets/stores/store-categories/Plants.png',
  },
  {
    id: 20,
    title: StoreCategoryTitle.RESTAURANT,
    subtitle: 'رستوران، کافه،‌ آبمیوه‌‌فروشی',
    image: 'assets/stores/store-categories/Restaurant.png',
  },
  {
    id: 21,
    title: StoreCategoryTitle.SPORT,
    subtitle: 'باشگاه و استخر، لوازم ورزشی و کمپینگ',
    image: 'assets/stores/store-categories/SportandCamping.png',
  },
  {
    id: 22,
    title: StoreCategoryTitle.INTERNET_SERVICES,
    subtitle: 'خرید اینترنت و مودم',
    image: 'assets/stores/store-categories/InternetServices.png',
  },
  {
    id: 23,
    title: StoreCategoryTitle.ONLINE_SHOP,
    subtitle: 'لوازم دیجیتال، برقی، آرایشی، پوشاک و ...',
    image: 'assets/stores/store-categories/OnlineShop.png',
  },
];

export enum StoreRestrictionFields {
  TITLE = 'title',
  CATEGORIES = 'categories',
  KEYWORD = 'keyword',
  PAYMENT_METHODS = 'paymentMethods',
  SORT = 'sort',
  STORE_TYPE = 'types',
  TRACKING_CODE = 'trackingCode',
  IS_DEACTIVE = 'state.disabled',
  TAG = 'tags',
  CLICK = 'click',
}

export const StoreRestrictionToFilterComponentIdMapper: Record<StoreRestrictionFields, string> = {
  [StoreRestrictionFields.SORT]: 'StoreSortFilters',
  [StoreRestrictionFields.CATEGORIES]: 'StoreCategoryFilters',
  [StoreRestrictionFields.PAYMENT_METHODS]: 'StorePaymentMethodFilters',
  [StoreRestrictionFields.STORE_TYPE]: 'StoreTypeFilters',
  [StoreRestrictionFields.KEYWORD]: '',
  [StoreRestrictionFields.TITLE]: '',
  [StoreRestrictionFields.IS_DEACTIVE]: '',
  [StoreRestrictionFields.TRACKING_CODE]: '',
  [StoreRestrictionFields.TAG]: '',
  [StoreRestrictionFields.CLICK]: '',
};

export const suggestedSearchesConst: Array<string> = ['موبایل', 'لپ تاپ', 'هندزفری', 'سرخ کن', 'ماشین لباسشویی', 'سامسونگ'];
