import { ApiResultInterface } from '@client-monorepo/common/network';

export interface UploadAvatarResponseInterface {
  result: ApiResultInterface;

  fileId: string;
}
