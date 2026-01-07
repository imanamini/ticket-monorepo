export type OkalaProduct = {
  id: number;
  name: string;
  shortDescription: string;
  isShowDiscount: boolean;
  discountPercent: number;
  quantity: number;
  maxOrderLimit: number;
  okPrice: number;
  thumbImage: string;
  noInPackage: number;
  webLink: string;
  hasQuantity: boolean;
  maximumOrderWholesale: number;
  price: number;
  storeName: string;
  storeId: number;
  storeTypeName: string | null;
  storeTypeId: number;
  imageUrl: string;
};

export type OkalaCarousel = {
  id: number;
  isTapsiMarket: boolean;
  icon: string;
  tapsiMarketIcon: string;
  title: string;
  tapsiMarketTitle: string;
  subTitle: string | null;
  tapsiMarketSubTitle: string | null;
  backgroundColor: string | null;
  tapsiMarketBackgroundColor: string | null;
  storeTypeId: number | null;
  isMulti: boolean;
  isSingle: boolean;
  carouselTypeId: number;
  discountConfig: number;
  minItemCount: number;
  carouselType: string;
  displayOrder: number;
  startTime: string; // ISO string
  currentServerTime: string;
  endTime: string;
  isActive: boolean;
  isSingleStore: boolean;
  sortTypeId: number;
  sectionPositionId: number;
  position: number;
  displayType: number;
  storeIds: number[];
  products: OkalaProduct[];
};

export type OkalaSubCarousels = {
  entities: OkalaSubCarouselEntity[];
};

export type OkalaSubCarouselEntity = { storeName: string; products: OkalaProduct[] };
