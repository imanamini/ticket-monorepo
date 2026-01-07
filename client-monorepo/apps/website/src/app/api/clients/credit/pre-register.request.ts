export interface PreRegisterRequest {
  nationalCode: string;
  birthDate: number;
  planId: string;
  groupId?: string;
  organizationId?: string;
}
