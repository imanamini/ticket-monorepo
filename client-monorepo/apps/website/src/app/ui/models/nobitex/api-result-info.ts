export interface ApiResultInfo {
  info: {
    message: string;
    status?: number;
  };
  success?: boolean;
}
