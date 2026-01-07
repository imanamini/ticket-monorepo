export interface ConfigResponseModel {
  cdnUrl: string;
  userId: string;
  userSsoId: string;
  roles: RoleConfigModel[];
  permissions: PermissionConfigModel[];
  navigations: NavigationConfigModel[];
  categories: ConfigurationContractModel[];
  businesses: ConfigurationContractModel[];
  policyStates: ConfigurationContractModel[];
  policyCancelReasons: ConfigurationContractModel[];
  claimStates: ConfigurationContractModel[];
  claimCancelReasons: ConfigurationContractModel[];
  logWorkCategories: ConfigurationContractModel[];
  purchaseStates: ConfigurationContractModel[];
  saleChannels: ConfigurationContractModel[];
}

export interface ConfigurationContractModel {
  id: string;
  title: string;
  identifier: string;
  value: null | string;
  description: null | string;
  additionalData: AdditionalData | null;
}

export interface AdditionalData {
  color: string;
  backgroundColor: string;
}

export interface NavigationConfigModel {
  items?: NavigationConfigModel[];
  id: number;
  name: null | string;
  title: string;
  link: null | string;
  image: null | string;
}

export interface PermissionConfigModel {
  permissionId: string;
  keyword: string;
  title: string;
}

export interface RoleConfigModel {
  userRoleId: string;
  roleId: string;
  roleName: string;
  typeId: string;
  companyId: string;
  typeTitle: string;
  name: string;
}
