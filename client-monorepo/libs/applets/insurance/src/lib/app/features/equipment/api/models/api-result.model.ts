export interface GeneralResponse<T> {
  result: ResultModel;
  data: T;
  paging?: PagingModel;
}

export interface ResultModel {
  status: number;
  description: string;
  httpCode: number;
  situationCode: string;
  traceId: string;
}

export interface PagingModel {
  size: number;
  page: number;
  count: number;
  pages: number;
}
