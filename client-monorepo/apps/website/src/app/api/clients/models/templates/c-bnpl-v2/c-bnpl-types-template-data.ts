import { ApiFile } from '../../common/api-file';

export interface CBnplTypesTemplateData {
  creditDetails: CBnplTypesCreditDetailTemplateData[];
  creditImage: ApiFile;
  icon: ApiFile;
  title: string;
}

export interface CBnplTypesCreditDetailTemplateData {
  title: string;
  subtitle: string;
  description: {
    type: string;
    text: string;
  };
}
