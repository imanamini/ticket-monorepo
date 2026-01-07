import { RenewalApiService } from '../../api/services/renewal/renewal-api.service';
import { UsedApiService } from '../../api/services/used/used-api.service';
import { SharedUsedService } from '../../routes/used/services/shared-used.service';
import { SharedRenewalService } from '../../routes/renewal/services/shared-renewal.service';

export interface SharedStepsServiceModel {
  service: SharedRenewalService | SharedUsedService;
  apiService: RenewalApiService | UsedApiService;
}
