import { PageEnum } from '../enums/page.enum';

export interface UpgStrategy {
  implement(PageEnum: PageEnum): void;
}
