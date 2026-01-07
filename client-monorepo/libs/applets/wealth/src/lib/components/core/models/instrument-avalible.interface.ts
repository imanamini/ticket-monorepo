import { InstrumentOfftimeReason } from '../../../data-access/enums/instrument-offtime-reason';

export interface IInstrumentAvalible {
  iconTitle: string;
  isAvailable: boolean;
  noticeMessage: string;
  noticeTitle: string;
  unavailabilityReason: InstrumentOfftimeReason;
}
