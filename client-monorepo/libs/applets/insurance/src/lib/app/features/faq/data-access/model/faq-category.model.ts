import { FaqCategoryTypeEnum } from '../../../../data-access/enums/faq-category-type.enum';

export interface FaqCategoryModel {
  title: string;
  type: FaqCategoryTypeEnum;
}
