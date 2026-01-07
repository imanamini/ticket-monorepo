import { CutOffComponent } from '../components/cut-off/cut-off.component';

export enum IplErrorEnum {
  CutOff = 1,
}

export const IplErrorComponentsMapper = {
  [IplErrorEnum.CutOff]: CutOffComponent,
};
