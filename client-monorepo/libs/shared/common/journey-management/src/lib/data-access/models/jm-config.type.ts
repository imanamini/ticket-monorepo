import { JmMode } from './jm.enums';
import { BaseJourney } from './jurney-types';

export type JmConfig = {
  mode: JmMode;
  data: BaseJourney;
};
