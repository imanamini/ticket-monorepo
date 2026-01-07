import { FineDetail } from './fine-detail';
import { FineStatus } from './fine-status';

export interface Fine {
  fineType: number;
  title: string;
  imageId: string;
  status: FineStatus;
  statusText: string;
  fineDetail: FineDetail;
  color: number;
  alertDto: {
    actionTitle: string;
    backgroundColor: number;
    description: {
      keywords: string[];
      note: string;
    };
    imageId: string;
    textColor: number;
  };
  hasImage: boolean;
  violationId: string;
}
