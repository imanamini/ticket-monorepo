export interface SampleQueryModel {
  orders: QueryOrder[];
  restrictions: any[];
  page: number;
  take: number;
}

export interface QueryOrder {
  field: string;
  order: string;
}
