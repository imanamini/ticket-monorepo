import { ApiResultInterface } from '@client-monorepo/common/network';
import { AppServiceInterface } from './app-service.interface';

export interface AppServiceResponseInterface {
  result: ApiResultInterface;
  appServices: Array<AppServiceInterface>;
}
