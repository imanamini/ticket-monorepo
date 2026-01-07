import {ApiFile} from "../../../../../api/clients/models/common/api-file";

export interface Partners {
  title:string,
  subtitle:string,
  items :partnerItem[]
}


export interface partnerItem{
  itemTitle:string,
  itemLogo:ApiFile
}
