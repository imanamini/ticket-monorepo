import { environment } from '../../environments/environment';

const API_CONSTANTS = {
  HTTP_AGENT: 'WEBSITE',
  USER_NAME: environment.api_core.username,
  USER_KEY: environment.api_core.password,
  DIGIPAY_VERSION: environment.api_core.version,
};

export { API_CONSTANTS };
