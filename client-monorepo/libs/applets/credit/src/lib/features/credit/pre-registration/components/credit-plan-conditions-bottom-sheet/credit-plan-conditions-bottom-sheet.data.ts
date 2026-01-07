export interface CreditPlanConditionsBottomSheetData {
  title: string;
  conditions: {
    title: string;
    description?: string;
  }[];
  hintMessage?: string;
}
