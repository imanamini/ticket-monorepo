export interface ApiResult {
  message: string;
  level: string;
  status: number;
  title: string;
  error?: { result: ApiResult };
}
