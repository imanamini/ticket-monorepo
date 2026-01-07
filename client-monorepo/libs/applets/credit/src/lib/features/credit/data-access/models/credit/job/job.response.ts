import { GenericApiResponse } from '../../generic-api-response.model';
import { Job } from './job.model';

export interface JobsResponse extends GenericApiResponse {
  jobs: Array<Job>;
}
