export interface Recommendation {
  color: number;
  imageId: string;
  info: Array<{
    label: string,
    value: string,
    position: number,
  }>;
  type: number;
  id: string;
  title: string;
  subTitle: string;
  pinned: boolean;
}
