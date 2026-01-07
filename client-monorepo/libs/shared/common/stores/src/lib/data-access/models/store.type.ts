import { BadgeType } from '@digipay/ngx-badge/lib/ngx-badge.type';

export type Store = {
  title: string;
  subtitle: string;
  coverImageId: string; // image
  businessId: string;
  logoImageId: string; // image
  description: string; // html
  branches: StoreBranch[];
  priority: number;
  types: StoreType[];
  categories: string[];
  vouchers: StoreVoucher[];
  badges: StoreBadge[];
  productCategories: string[];
  paymentMethods: StorePaymentMethod[];
  url: string;
  tags: string[];
  active: boolean;
  storeCategories?: string[];
  trackingCode: string;
  distance?: number;
  landingUrl?: string;
  state?: StoreState;
  creationDate?: number;
  score?: StoreScore;
  auction?: boolean;
  instagram?: StoreInstagramModel;
  whatsApp?: StoreWhatsappModel;
}

export enum StorePaymentMethod {
  POS = 0,
  QR_CODE = 1,
  BNPL = 2,
  C_CREDIT = 3,
  IPG = 4,
  BARCODE = 5,
}

export enum StoreType {
  ONSITE = 0,
  ONLINE = 1,
  SOCIAL_INSTAGRAM = 3,
}

export type StoreBadge = {
  type: BadgeType;
  content: string;
  status: 'info' | 'success' | 'warning' | 'error' | 'inactive';
  mode: 'bold' | 'fill' | 'outline';
  icon: string;
};

export type StoreVoucher = {
  title: string;
  description: string;
  code: string;
  expirationDate: number;
};

export enum StoreSort {
  A_Z = 'a-z',
  Z_A = 'z-a',
  PRIORITY = 'priority',
  CREATION_DATE = 'creationDate',
  AUCTION = 'auction',
}

export type StoreCategory = {
  id: number;
  title: StoreCategoryTitle;
  subtitle: string;
  image: string; // image
  parentId?: string;
};

export type StoreState = {
  disabled: boolean;
  crawled: boolean;
};

export type StoreScore = {
  score: number;
  count: number;
};

export enum StoreCategoryTitle {
  CARS_AND_MOTORCYCLES = 'CARS_AND_MOTORCYCLES',
  GOLD_AND_COINS = 'GOLD_AND_COINS',
  DIGITAL = 'DIGITAL',
  FASHION_AND_CLOTHING = 'FASHION_AND_CLOTHING',
  TOYS_FOR_CHILDREN_AND_BABIES = 'TOYS_FOR_CHILDREN_AND_BABIES',
  HOUSEHOLD_CONSUMER = 'HOUSEHOLD_CONSUMER',
  BEAUTY_AND_HEALTH = 'BEAUTY_AND_HEALTH',
  HOME_AND_KITCHEN = 'HOME_AND_KITCHEN',
  BUILDING_TOOLS_AND_INDUSTRIAL_EQUIPMENT = 'BUILDING_TOOLS_AND_INDUSTRIAL_EQUIPMENT',
  BOOKS_STATIONERY = 'BOOKS_STATIONERY',
  SPORTS_AND_TRAVEL = 'SPORTS_AND_TRAVEL',
  MEDICINE_AND_TREATMENT = 'MEDICINE_AND_TREATMENT',
  EDUCATION_AND_ENTERTAINMENT = 'EDUCATION_AND_ENTERTAINMENT',
  SERVICES = 'SERVICES',
  ENTERTAINMENT_AND_TOURISM = 'ENTERTAINMENT_AND_TOURISM',
  PETS = 'PETS',
  FLOWER_AND_PLANTS = 'FLOWER_AND_PLANTS',
  BIRTHDAY_GIFTS_AND_ACCESSORIES = 'BIRTHDAY_GIFTS_AND_ACCESSORIES',
  RESTAURANT = 'RESTAURANT',
  SPORT = 'SPORT',
  ONLINE_SHOP = 'ONLINE_SHOP',
  INTERNET_SERVICES = 'INTERNET_SERVICES',
}

export type StoreBranch = {
  branchId: string;
  storeTrackingCode: string;
  title: string;
  distance?: number;
  address: string;
  phoneNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export const StorePaymentMethodMapper: Record<StorePaymentMethod, string> = {
  [StorePaymentMethod.BNPL]: 'خرید اعتباری',
  [StorePaymentMethod.IPG]: 'آنلاین',
  [StorePaymentMethod.POS]: 'حضوری',
  [StorePaymentMethod.C_CREDIT]: 'خرید با وام',
  [StorePaymentMethod.QR_CODE]: 'خرید با کیوآر',
  [StorePaymentMethod.BARCODE]: 'خرید با بارکد',
};

export const StoreTypeMapper: Record<StoreType, string> = {
  [StoreType.ONSITE]: 'حضوری',
  [StoreType.ONLINE]: 'آنلاین',
  [StoreType.SOCIAL_INSTAGRAM]: 'اینستاگرام',
};

export const StoreSortMapper: Record<StoreSort, string> = {
  [StoreSort.A_Z]: 'الفبا از اول به آخر',
  [StoreSort.Z_A]: 'الفبا از آخر به اول',
  [StoreSort.PRIORITY]: 'محبوب‌ترین',
  [StoreSort.CREATION_DATE]: 'جدیدترین',
  [StoreSort.AUCTION]: 'تخفیف‌دار',
};

export const StoreCategoryTitleMapper: Record<StoreCategoryTitle, string> = {
  [StoreCategoryTitle.GOLD_AND_COINS]: 'زیورآلات و سکه',
  [StoreCategoryTitle.DIGITAL]: 'کالای دیجیتال',
  [StoreCategoryTitle.FASHION_AND_CLOTHING]: 'مد و پوشاک',
  [StoreCategoryTitle.SPORTS_AND_TRAVEL]: 'تفریح و سرگرمی',
  [StoreCategoryTitle.ENTERTAINMENT_AND_TOURISM]: 'سفر و گردشگری',
  [StoreCategoryTitle.MEDICINE_AND_TREATMENT]: 'سلامت و درمان',
  [StoreCategoryTitle.BEAUTY_AND_HEALTH]: 'زیبایی و بهداشت',
  [StoreCategoryTitle.TOYS_FOR_CHILDREN_AND_BABIES]: 'لوازم کودک',
  [StoreCategoryTitle.HOUSEHOLD_CONSUMER]: 'کالای مصرفی خانوار',
  [StoreCategoryTitle.HOME_AND_KITCHEN]: 'خانه و آشپزخانه',
  [StoreCategoryTitle.BUILDING_TOOLS_AND_INDUSTRIAL_EQUIPMENT]: 'ابزارآلات و تجهیزات',
  [StoreCategoryTitle.BOOKS_STATIONERY]: 'کتاب و لوازم تحریر',
  [StoreCategoryTitle.CARS_AND_MOTORCYCLES]: 'خودرو و موتورسیکلت',
  [StoreCategoryTitle.EDUCATION_AND_ENTERTAINMENT]: 'دوره‌های آموزشی',
  [StoreCategoryTitle.SERVICES]: 'خدمات',
  [StoreCategoryTitle.RESTAURANT]: 'کافه و رستوران',
  [StoreCategoryTitle.PETS]: 'حیوانات خانگی',
  [StoreCategoryTitle.FLOWER_AND_PLANTS]: 'گل و گیاه',
  [StoreCategoryTitle.BIRTHDAY_GIFTS_AND_ACCESSORIES]: 'هدیه و لوازم تولد',
  [StoreCategoryTitle.SPORT]: 'ورزش و کمپینگ',
  [StoreCategoryTitle.INTERNET_SERVICES]: 'خدمات اینترنت',
  [StoreCategoryTitle.ONLINE_SHOP]: 'فروشگاه اینترنتی',
};

export const StoreCategoryDiscountMapper: Record<StoreCategoryTitle, number> = {
  [StoreCategoryTitle.GOLD_AND_COINS]: 20,
  [StoreCategoryTitle.DIGITAL]: 60,
  [StoreCategoryTitle.FASHION_AND_CLOTHING]: 80,
  [StoreCategoryTitle.SPORTS_AND_TRAVEL]: 80,
  [StoreCategoryTitle.ENTERTAINMENT_AND_TOURISM]: 50,
  [StoreCategoryTitle.MEDICINE_AND_TREATMENT]: 20,
  [StoreCategoryTitle.BEAUTY_AND_HEALTH]: 80,
  [StoreCategoryTitle.TOYS_FOR_CHILDREN_AND_BABIES]: 60,
  [StoreCategoryTitle.HOUSEHOLD_CONSUMER]: 60,
  [StoreCategoryTitle.HOME_AND_KITCHEN]: 50,
  [StoreCategoryTitle.BUILDING_TOOLS_AND_INDUSTRIAL_EQUIPMENT]: 60,
  [StoreCategoryTitle.BOOKS_STATIONERY]: 40,
  [StoreCategoryTitle.CARS_AND_MOTORCYCLES]: 20,
  [StoreCategoryTitle.EDUCATION_AND_ENTERTAINMENT]: 90,
  [StoreCategoryTitle.SERVICES]: 20,
  [StoreCategoryTitle.RESTAURANT]: 30,
  [StoreCategoryTitle.PETS]: 30,
  [StoreCategoryTitle.FLOWER_AND_PLANTS]: 20,
  [StoreCategoryTitle.BIRTHDAY_GIFTS_AND_ACCESSORIES]: 70,
  [StoreCategoryTitle.SPORT]: 50,
  [StoreCategoryTitle.INTERNET_SERVICES]: 50,
  [StoreCategoryTitle.ONLINE_SHOP]: 90,
};

export interface StoreInstagramModel {
  creationDate: string;
  externalId: string;
  followersCount: number;
  followingCount: number;
  lastModificationDate: string;
  postsCount: number;
  url: string;
  username: string;
}

export interface StoreWhatsappModel {
  cellphone: string;
  creationDate: string;
  externalId: string;
  lastModificationDate: string;
  url: string;
}
