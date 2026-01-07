export interface OpenFeedbackInterface extends Window {
  openFeedback(params: feedBackParamsModel): void;
}

export interface feedBackParamsModel {
  imageUrl: string;
  title: string;
  description: string;
  buttonTitle: string;
  buttonLink: string;
}
