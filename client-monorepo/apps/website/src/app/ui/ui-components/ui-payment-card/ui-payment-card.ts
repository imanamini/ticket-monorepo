export interface UiPaymentCard {
  title: string;
  amount: number;
  imageId: string;
  details: Array<{
    label: string;
    value: any;
  }>;
  description?: {
    title: string;
    items?: Array<string | number>;
  };
  id?: string; // Optional identifier
}
