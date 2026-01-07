import { DeviceTypeEnum } from '../pages/upload-image-device/models/device-type.enum';

export interface FileModel {
  documentName: string;
  documentPath: string;
  documentType: DeviceTypeEnum;
  file: FormData;
  id?: string;
}
