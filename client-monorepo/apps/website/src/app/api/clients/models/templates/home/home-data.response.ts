import { BaseResponse } from '../../base.response';
import { BlogPost } from '../../content/blog-post';
import { Page } from '../../content/page';
import { ApiFile } from '../../common/api-file';
import { RelatedPosts } from '../blog/related-posts';
import { ContentNavData } from '../../../../../ui/models/content-nav-data';

export interface HomeDataResponse extends BaseResponse {
  posts: BlogPost[];
  page: Page<HomeTemplateData>;
  categories: any;
  TOP_BANNER: any;
}

export interface HomeTemplateData {
  introTitle: string;
  introSubtitle: string;
  relatedPosts: RelatedPosts;
  mainServices: HomeMainService[];
  businessServices: ContentNavData;
  ourCustomers: HomeCustomerDefinition;
  digiland: DigilandBanner;
}

export interface HomeMainService {
  icon2dim: ApiFile;
  icon3dim: ApiFile;
  title: string;
  description: string;
  url: string;
}

export interface HomeCustomerDefinition {
  title: string;
  logos: Array<{
    name: string;
    address: string;
    logoImg: ApiFile;
  }>;
}

export interface DigilandBanner {
  link: string;
}
