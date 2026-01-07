import { ApiFile } from '../common/api-file';

export interface Page<TemplateData> {
  title: string;
  slug: string;
  content: string;
  seoKeywords: string;
  seoTitle: string;
  seoDescription: string;
  lang: string;
  categoryId: string;
  seoNoIndex: boolean;
  templateData: TemplateData;
  image: ApiFile;
  canonical: string;
  pathPrefix: string;
}
