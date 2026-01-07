export interface ApiResult {
  message: string;
  level: string;
  status: number;
  title: string;
}

export interface GenericApiResponse {
  result: ApiResult;
}
