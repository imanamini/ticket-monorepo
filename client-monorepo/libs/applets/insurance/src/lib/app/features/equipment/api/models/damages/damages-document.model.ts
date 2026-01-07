import { uploadBoxType } from '../../../../../components/ui-upload-box/ui-upload-box.component';

export interface DamagesDocumentModel {
  additionalData: string;
  description: string;
  id: string;
  identifier: string;
  title: string;
  uploadType: uploadBoxType;
}
