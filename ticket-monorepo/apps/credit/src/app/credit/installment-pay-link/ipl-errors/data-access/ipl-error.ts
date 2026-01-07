import { ExpiredLinkComponent } from '../components/expired-link/expired-link.component';
import { ProblemDgServiceComponent } from '../components/problem-dg-service/problem-dg-service.component';
import { CutOffComponent } from '../components/cut-off/cut-off.component';

export enum IplErrorEnum {
  CutOff,
  ExpiredLink,
  ProblemDgService,
}

export const IplErrorComponentsMapper = {
  [IplErrorEnum.CutOff]: CutOffComponent,
  [IplErrorEnum.ExpiredLink]: ExpiredLinkComponent,
  [IplErrorEnum.ProblemDgService]: ProblemDgServiceComponent,
};
