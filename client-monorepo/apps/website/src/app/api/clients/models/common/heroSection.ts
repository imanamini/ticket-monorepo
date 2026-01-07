import { ApiFile } from './api-file';

export interface HeroSection {
  title: string;
  subtitle: string;
  cta: {
    id: string;
    title: string;
    link: string;
  },
  image: ApiFile;
  qr: ApiFile;
}
