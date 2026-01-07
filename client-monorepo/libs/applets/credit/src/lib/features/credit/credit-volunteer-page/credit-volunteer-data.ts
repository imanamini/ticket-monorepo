export interface CreditVolunteerData {
  title: string;
  message: string;
  staticImage: 'pending';
  primaryCta: string;
  secondaryCta: string;
  pageTitle?: string;
  notBlocker?: boolean;
  ctaPriority?: 'high' | 'low';
}
