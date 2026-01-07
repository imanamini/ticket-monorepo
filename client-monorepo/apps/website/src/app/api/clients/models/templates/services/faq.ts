export interface FaqDefinition {
  title: string;
  subtitle: string;
  categoryId: string;
  faqItems: FaqItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
  snippet: any;
  itemId?: string;
}
