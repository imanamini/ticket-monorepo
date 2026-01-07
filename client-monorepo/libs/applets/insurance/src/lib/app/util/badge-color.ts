import { BadgeStatusEnum } from '../data-access/enums/badge-status.enum';
import { ClaimModel } from '../features/equipment/api/models/claim/claim-models';

export const COLOR_BADGE =
  new Map<BadgeStatusEnum, string[]>([
    [BadgeStatusEnum.Error, ['RejectedByClaimExpert', 'CancelledByCustomer']],
    [BadgeStatusEnum.Warning, ['CustomerContacted', 'NewClaim', 'CustomerContacted']],
    [BadgeStatusEnum.Info, ['CustomerApproved', 'DeviceSentForRepair', 'DeviceSentForCustomer', 'DeviceReceived',
      'DeviceReturnCoordinated', 'DeviceIsReadyToReceive', 'CustomerApproved', 'DeviceSentForRepair', 'DeviceSentForCustomer',
      'DeviceReceived', 'DeviceReturnCoordinated', 'DeviceIsReadyToReceive']],
    [BadgeStatusEnum.Success, ['CompensationShouldPay', 'CompensationPayed', 'DeviceIsReadyToSendBack'
      , 'DeviceRepaired', 'CompensationShouldPay', 'CompensationPayed', 'DeviceIsReadyToSendBack', 'DeviceRepaired']],
  ]);

export function claimStatus(claim: ClaimModel): BadgeStatusEnum {
  return Array.from(COLOR_BADGE.entries()).find(([key, values]) =>
    values.includes(claim.claimStatus.stepKey)
  )?.[0];
}
