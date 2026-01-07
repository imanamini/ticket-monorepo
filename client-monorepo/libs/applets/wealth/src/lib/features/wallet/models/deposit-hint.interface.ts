export interface ISteps {
  parts: IParts[];
}
export interface IParts {
  type: 'text' | 'boldText' | 'link';
  value: string;
  link?: string;
  eventId?: string;
}
