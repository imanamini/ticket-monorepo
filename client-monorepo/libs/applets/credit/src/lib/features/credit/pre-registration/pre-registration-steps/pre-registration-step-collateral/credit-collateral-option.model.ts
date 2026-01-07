import { NoteTypes } from '../../../data-access/models/credit/activation/enote-step/enote-types.enum';

export interface CreditCollateralOptionModel {
  collateralAmount: number[];
  value: any;
  title: string;
  disabled?: boolean;
  tooltip?: string;
  registerCost?: string;
  priority?: number;
  type?: NoteTypes;
  listOption?: any;
}
