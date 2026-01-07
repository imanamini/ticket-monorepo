import {
  UploadDocumentTypeEnum
} from '../../../../features/third-party/features/order/data-access/enums/upload-document-type.enum';
import { DocumentStateEnum } from '../../../../../../components/ui-upload-image/ui-upload-image.enum';

export interface UploadedDocumentModel {
  id: number;
  type: UploadDocumentTypeEnum;
  filePath?: any;
  fileType?: any;
  fileName: string;
  title: string;
  file?: File;
  documentState?: DocumentStateEnum;
}
