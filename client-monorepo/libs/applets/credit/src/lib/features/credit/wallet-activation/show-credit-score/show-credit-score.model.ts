export interface ShowCreditScoreModel {
  title: string;
  level: string;
  backUrl?: string;
  backRouteState?: any;
  description: string;
  button?: {
    text: string;
  };
  circle: {
    percent: number;
    fillColor: string;
    subtitle: string;
    icon: 'warning' | 'success';
    imageId: string;
    color: string;
    score: string;
  };
}
