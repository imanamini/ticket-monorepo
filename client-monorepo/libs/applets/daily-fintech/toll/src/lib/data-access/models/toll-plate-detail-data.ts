import { StoredPlate, TollDebt } from '@client-monorepo/daily-fintech/vehicle-data';

export interface TollPlateDetailInput {
  toll: TollDebt;
  plate: StoredPlate;
}

export interface TollPlateDetailOutput {
  result: 'success';
}
