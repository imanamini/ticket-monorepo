import { PageEnum } from './page.enum';

export interface UpgStrategy {
  implement(PageEnum: PageEnum): void;
}
