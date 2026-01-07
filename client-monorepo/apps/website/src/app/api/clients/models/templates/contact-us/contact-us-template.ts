import { ApiFile } from '../../common/api-file';

export interface ContactUsTemplate {
  introIcon: ApiFile;
  introTitle: string;
  introSubtitle: string;
  mainServices: Array<{
    title: string;
    service: Array<{
      image: ApiFile;
      title: string;
      link: string;
    }>;
  }>;
  mainForm: {
    title: string;
    description: string;
    notice: string;
  };
  mainVacations: {
    title: string;
    description: string;
    vacation: Array<{
      day: string;
      month: string;
      reason: string;
    }>;
  };
  mainContact: {
    internal: string;
    phone: string;
    title: string;
    address: string;
    email: string;
    map: ApiFile;
  };
}
