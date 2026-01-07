export interface ProductCardCoverageDetailBottomSheetModel {
  title: string;
  sections: CoverageSection[];
}

export interface CoverageSection {
  title: string;
  details: {
    title: string;
    value?: string;
  }[];
}
