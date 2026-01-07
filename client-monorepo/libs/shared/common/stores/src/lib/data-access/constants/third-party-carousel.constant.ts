import {
  OkalaApiResponse,
  TapsiShopApiResponse,
  ThirdPartyCarouselConfig,
  ThirdPartyCarouselFields,
} from '../models/third-party-carousel.model';

// The website must be notified of any changes.
export const THIRD_PARTY_CAROUSEL_Config: Record<string, ThirdPartyCarouselConfig> = {
  'tapsi-shop': {
    apiUrl: 'tapsishop',
    transformer: (data: TapsiShopApiResponse) => tapsiShopTransformer(data),
    apiMethod: 'POST',
    apiBody: {
      id: '1363916929025880064',
      pagesize: 30,
      pagenumber: 1,
      facets: 192,
      onlyvalidvendors: true,
      onlyavailableproducts: true,
      onlyvendorswithvalidcontract: true,
      invalidfinalexpressdetermination: [4, 5],
    },
    includeLocation: false,
    color: '#FE5722',
  },
  okala: {
    apiUrl: 'okala-lucifer',
    transformer: (data: OkalaApiResponse) => OkalaTransformer(data),
    apiMethod: 'GET',
    includeLocation: true,
    color: '#F11335',
  },
};

function tapsiShopTransformer(data: TapsiShopApiResponse): ThirdPartyCarouselFields {
  const fields: ThirdPartyCarouselFields = {
    logo: '/assets/stores/tapsi-shop.svg',
    title: 'پرتخفیف‌ترین‌ در تپسی‌شاپ',
    subtitle: data.data.metadata.title,
    redirectUrl: 'https://tapsi.shop/search/?collectionId=1363916929025880064',
    endtime: getTapsiShopEndTime(data),
    products: [],
  };
  for (const product of data.data.products) {
    fields.products.push({
      image: 'https://assets.tapsi.shop' + product.defaultImage + '?h=88',
      discount: product.discount,
    });
  }
  fields.products.sort(() => Math.random() - 0.5);
  return fields;
}

function getTapsiShopEndTime(data: TapsiShopApiResponse): number {
  let endTime = 0;
  try {
    for (const product of data.data.products) {
      const productEndTime = new Date(product.level.toDate).getTime();
      if (endTime === 0 || productEndTime < endTime) {
        endTime = productEndTime;
      }
    }
  } catch {
    /* empty */
  }
  return endTime;
}

function OkalaTransformer(data: OkalaApiResponse): ThirdPartyCarouselFields {
  const fields: ThirdPartyCarouselFields = {
    logo: '/assets/stores/okala.svg',
    title: 'پرتخفیف‌ترین‌ در اکالا',
    subtitle: data.title,
    redirectUrl: data.showMore.cta,
    endtime: new Date(data.finishTime).getTime(),
    products: [],
  };
  for (const product of data.items) {
    fields.products.push({
      image: product.imageUrl,
      discount: product.discountPercent,
    });
  }
  fields.products.sort(() => Math.random() - 0.5);
  return fields;
}
