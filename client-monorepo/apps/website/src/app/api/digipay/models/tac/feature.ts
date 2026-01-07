export interface Feature {
  editable: boolean;
  isProtected: number;
  title: string;
  url: string;
  relativeUrl: string; // local key doesn't exist in the API's response
}
