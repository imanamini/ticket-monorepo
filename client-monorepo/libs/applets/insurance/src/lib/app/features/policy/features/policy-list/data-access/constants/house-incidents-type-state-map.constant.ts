import { ListOptionEnum } from '../../../../data-access/enums/list-option.enum';
import { HouseIncidentsStateEnum } from '../../../../../house-incidents/data-access/enums/house-incidents-state.enum';

export const HOUSE_INCIDENTS_TYPE_STATE_MAP = {
  [ListOptionEnum.PURCHASED]: [
    HouseIncidentsStateEnum.Issued,
    HouseIncidentsStateEnum.Refused,
    HouseIncidentsStateEnum.Paid,
    HouseIncidentsStateEnum.UserInfoCompleted,
    HouseIncidentsStateEnum.Cancelled,
  ],
  [ListOptionEnum.RENEWAL]: [],
  [ListOptionEnum.UNCOMPLETE]: [
    HouseIncidentsStateEnum.Draft,
    HouseIncidentsStateEnum.PendingPayment,
    HouseIncidentsStateEnum.New
  ],
};
