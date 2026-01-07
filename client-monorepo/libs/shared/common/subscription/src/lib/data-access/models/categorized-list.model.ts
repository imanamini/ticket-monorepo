import { PlanServices } from '@client-monorepo/common/subscription';

export interface CategorizedListModel {
  title: string;
  tag: string;
  services: PlanServices[];
}
