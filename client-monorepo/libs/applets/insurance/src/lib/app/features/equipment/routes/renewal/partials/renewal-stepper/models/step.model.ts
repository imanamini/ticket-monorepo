import { StepStates } from './step-states';

export interface StepModel {
  title: string;
  activeIcon?: string;
  deActiveIcon?: string;
  stepperNumber: number;
  state: StepStates;
}
