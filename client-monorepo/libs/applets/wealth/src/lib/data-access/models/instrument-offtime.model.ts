import { InstrumentOfftimeReason } from '../enums/instrument-offtime-reason';

export class InstrumentOfftimeModel {
  isAvailable?: boolean;
  noticeMessage?: string;
  unavailabilityReason?: InstrumentOfftimeReason;
}
