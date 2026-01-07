export interface RateBody {
  uid: string;
  rate: RateBodyInfo;
}

export interface RateBodyInfo {
  comment: string;
  reasons: string[];
  score: number;
}
