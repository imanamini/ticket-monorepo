import { Injectable } from '@angular/core';
import { BaseHttpClient } from '../base-http-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobCategory } from './models/hr/job-category';
import { PaginatedResponse } from './models/common/paginated.response';
import { JobPostItem } from './models/hr/job-post-item';
import { JobPostDetails } from './models/hr/job-post-details';
import { ApplicationReceivedResponse } from './models/hr/application-received.response';

@Injectable({
  providedIn: 'root',
})
export class CareersClient extends BaseHttpClient {
  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  getJobCategories(): Observable<{
    categories: JobCategory[];
  }> {
    return super.get('/api/hr/public/categories');
  }

  searchJobs(page: number, perPage: number, categoryId: string = null): Observable<PaginatedResponse<JobPostItem>> {
    const params = {
      page,
      perPage,
    };
    if (categoryId) {
      params['categoryId'] = categoryId;
    }
    return super.get('/api/hr/public/jobs', params);
  }

  getJobPost(id: string): Observable<{
    jobPost: JobPostDetails;
  }> {
    return super.get('/api/hr/public/job/' + id);
  }

  submitApplication(applicationId: string, formData: FormData): Observable<ApplicationReceivedResponse> {
    return super.multipartPost('/api/hr/public/job/' + applicationId + '/apply', formData);
  }

  joinTalentNetwork(formData: FormData): Observable<ApplicationReceivedResponse> {
    return super.multipartPost('/api/hr/public/talent/join', formData);
  }
}
