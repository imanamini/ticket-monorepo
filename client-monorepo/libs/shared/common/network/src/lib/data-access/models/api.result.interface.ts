export interface ApiResultInterface {
  message: string;
  level: string;
  status: number;
  title: string;
  error?: { result: ApiResultInterface };
}
