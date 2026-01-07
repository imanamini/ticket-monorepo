import { TitleValueModel } from './title-value.model';

export interface TitleValueContentDataModel extends TitleValueModel {
  type: 'text' | 'plate' | 'plate-motor';
  ellipsis?: boolean;
  class?: string;
}
