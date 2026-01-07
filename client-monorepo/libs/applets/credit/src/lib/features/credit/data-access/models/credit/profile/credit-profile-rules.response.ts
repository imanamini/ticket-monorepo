import { GenericApiResponse } from '../../generic-api-response.model';

export enum CREDIT_PROFILE_RULE {
  OPTIONAL = 0,
  MANDATORY = 1,
}

export interface CreditProfileRulesResponse extends GenericApiResponse {
  header: {
    content: string;
    color: string;
    bgColor: string;
    strokeColor: string;
  };
  fieldRules: Array<{
    field: string;
    option: CREDIT_PROFILE_RULE;
  }>;
  // LOCAL NOT IN THE API, FOR PERFORMANCE IMPROVEMENTS
  fieldRulesMap: {
    [key: string]: CREDIT_PROFILE_RULE;
  };
}
