export interface LogisticMethod {
  provinceId: number;
  provinceName: string;
  cities: City[];
}

export interface City {
  cityId: number;
  cityName: string;
  deliveryMethods: DeliveryMethod[];
}

export interface DeliveryMethod {
  value: number;
  displayName: string;
}
