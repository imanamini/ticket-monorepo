export interface ThirdPartyCarouselProduct {
  image: string;
  discount: string | number;
}

export interface ThirdPartyCarouselFields {
  logo: string;
  title: string;
  subtitle: string;
  redirectUrl: string;
  endtime?: number;
  products: ThirdPartyCarouselProduct[];
}

export interface ThirdPartyCarouselConfig {
  url?: string | undefined;
  apiUrl: string;
  transformer: (data: any) => ThirdPartyCarouselFields;
  apiMethod: 'GET' | 'POST';
  apiBody?: any;
  includeLocation?: boolean;
  color?: string;
}

export interface TapsiShopApiResponse {
  data: {
    products: {
      id: string;
      discount: number;
      defaultImage: string;
      level: {
        toDate: string;
      };
    }[];
    metadata: {
      title: string;
    };
  };
}

export interface OkalaApiResponse {
  title: string;
  startTime: string;
  finishTime: string;
  background: {
    start: string;
    end: string;
  };
  showMore: {
    enabled: boolean;
    cta: string;
  };
  items: [
    {
      productId: number;
      title: string;
      imageUrl: string;
      storeName: string;
      storeId: number;
      price: number;
      discountPercent: number;
      cta: string;
    },
  ];
}
