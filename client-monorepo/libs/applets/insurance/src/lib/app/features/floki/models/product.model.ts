import { CoverageAvailabilitiesModel } from './coverage-availabilities.model';

export interface ProductModel {
  id: string;
  name: string;
  description: string;
  insurerPartyName: string;
  insurerImageName?: any;
  insurerImagePath?: any;
  productImagePath: string;
  productImageName: string;
  productBackgroundColor: string;
  price: number;
  priceBeforeMarkdown?: any;
  coverageAvailabilities: CoverageAvailabilitiesModel[];
}
