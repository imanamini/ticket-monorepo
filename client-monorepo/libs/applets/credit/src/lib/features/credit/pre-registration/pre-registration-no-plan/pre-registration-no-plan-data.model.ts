export interface CalloutMessage {
  title: string;
  description: string[];
}

export interface DataMapperItem {
  title: string;
  description: string;
  calloutMessage?: CalloutMessage;
}

export interface DataMapper {
  NO_PLAN: DataMapperItem;
  NO_PLAN_USER: DataMapperItem;
}