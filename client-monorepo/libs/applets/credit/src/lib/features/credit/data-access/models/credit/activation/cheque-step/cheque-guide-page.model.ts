export interface ChequeGuidePage {
  header: string;
  main: ChequeGuidePageMain;
}

export interface ChequeGuidePageMain {
  warnings?: string[];
  imageId?: string;
  items?: ChequeGuideItem[];
  dataTable?: ChequeGuideDataTable;
}

interface ChequeGuideItem {
  index: number;
  name: string;
  value: string;
  indexColor: string;
  valueBackgroundColor: string;
}

interface ChequeGuideDataTable {
  items: ChequeGuideDataTableItem[];
  options: {
    type: 'checkBox' | 'text';
    description: string;
  }[];
}

interface ChequeGuideDataTableItem {
  name: string;
  label: string;
  value: string;
  copyable: boolean;
}
