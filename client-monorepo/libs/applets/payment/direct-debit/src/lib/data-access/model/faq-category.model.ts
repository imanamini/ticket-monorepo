import { FaqCategoryTypeEnum } from './faq-category-type.enum';

export interface FaqCategoryModel {
  title: string;
  type: FaqCategoryTypeEnum;
}