export interface TermsDataModel {
  foreword: string;
  items: TermItemsModel[];
}

export interface TermItemsModel {
  title: string;
  clauses: string[];
}