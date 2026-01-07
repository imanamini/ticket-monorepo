import { EInstruments, EpdfType } from './instruments.enum';

const PDF_PATHS = new Map<EInstruments, Record<EpdfType, string>>([
  [
    EInstruments.SINA,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/sina-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/sina-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.BEHGOZIN,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/behgozin-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/behgozin-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '/wealth-assets/pdf/behgozin-contract.pdf',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.DAMAVAND,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/damavand-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/damavand-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.GOLRANG,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/golrang-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/golrang-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '/wealth-assets/pdf/golrang-contract.pdf',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.AFAGH,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/afagh-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/afagh-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '/wealth-assets/pdf/afagh-contract.pdf',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.AFAGH,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/afagh-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/afagh-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '/wealth-assets/pdf/afagh-contract.pdf',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.ACORD,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/acord-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/acord-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '/wealth-assets/pdf/acord-contract.pdf',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.ACORD,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/acord-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/acord-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '/wealth-assets/pdf/acord-contract.pdf',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.GARDESHGARI,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/gardeshgari-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/gardeshgari-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.LOTOS,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/lotos-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/lotos-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.GANJ,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/ganj-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/ganj-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.NEGIN,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/negin-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/negin-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.RISK,
    {
      [EpdfType.PROSPECTUS]: '',
      [EpdfType.STATUTE]: '',
      [EpdfType.REGULATIONS]: '',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '/wealth-assets/pdf/Risk.pdf',
    },
  ],
  [
    EInstruments.IPO,
    {
      [EpdfType.PROSPECTUS]: '',
      [EpdfType.STATUTE]: '',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.KARDAN,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/kardan-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/kardan-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.AKAM,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/akam-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/akam-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.VISTA,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/vista-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/vista-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.ZARVAN,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/zarvan-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/zarvan-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.KAMYAB,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/kamyab-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/kamyab-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.VBAZAR,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/vbazar-prospectus.pdf',
      [EpdfType.STATUTE]: '/wealth-assets/pdf/vbazar-statute.pdf',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/ETF-T-C.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
  [
    EInstruments.TREASURY,
    {
      [EpdfType.PROSPECTUS]: '/wealth-assets/pdf/treasury.pdf',
      [EpdfType.STATUTE]: '',
      [EpdfType.REGULATIONS]: '/wealth-assets/pdf/treasury.pdf',
      [EpdfType.CONTRACT]: '',
      [EpdfType.RISKSTATEMEBT]: '',
    },
  ],
]);

export const SYMBOL_MAP = new Map<string, EInstruments>([
  ['IRT3SSSF0001', EInstruments.SINA],
  ['IRTKLOTF0001', EInstruments.LOTOS],
  ['11421', EInstruments.GOLRANG],
  ['11997', EInstruments.DAMAVAND],
  ['11394', EInstruments.BEHGOZIN],
  ['10883', EInstruments.GARDESHGARI],
  ['regularation', EInstruments.REGULATIONS],
  ['IRTKGANJ0001', EInstruments.GANJ],
  ['IRT1KRIN0001', EInstruments.NEGIN],
  ['CROWD', EInstruments.RISK],
  ['IPO', EInstruments.IPO],
  ['IRT1SKDF0001', EInstruments.KARDAN],
  ['IRT1AFAG0001', EInstruments.AFAGH],
  ['IRT3FKOF0001', EInstruments.ACORD],
  ['IRT3AKMF0001', EInstruments.AKAM],
  ['IRT3SOVF0001', EInstruments.VISTA],
  ['IRTKZARV0001', EInstruments.ZARVAN],
  ['IRT3KAAF0001', EInstruments.KAMYAB],
  ['IRT1VBAZ0001', EInstruments.VBAZAR],
  ['treasury', EInstruments.TREASURY],
]);

/**
 *
 * @description
 *
 * You must update files {@link SYMBOL_MAP} and {@link PDF_PATHS} for the new conditions
 */
export function getPDFSource(symbol: EInstruments, type: EpdfType): string | undefined {
  return PDF_PATHS.get(symbol)?.[type];
}
