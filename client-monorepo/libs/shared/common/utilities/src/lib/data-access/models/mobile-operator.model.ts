export interface MobileOperator {
  imageId: string;
  name: string;
  description: string;
  operatorId: string;
  prefixes: Prefix[];
  colorRange: number[];
}

export interface Prefix {
  value: string;
  types: number[];
}

export interface SimTypeConfig {
  key: string;
  value: string;
  icon?: string;
  iconColor?: string;
}
