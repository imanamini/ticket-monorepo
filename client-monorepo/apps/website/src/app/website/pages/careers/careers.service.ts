import { Injectable } from '@angular/core';
import { CareersClient } from '../../../api/clients/careers-client';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { JobCategory } from '../../../api/clients/models/hr/job-category';
import { JobPostItem } from '../../../api/clients/models/hr/job-post-item';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { JobPostDetails } from '../../../api/clients/models/hr/job-post-details';

@Injectable({
  providedIn: 'root',
})
export class CareersService {
  jobCategories: BehaviorSubject<JobCategory[]> = new BehaviorSubject([]);

  selectedCategory: BehaviorSubject<JobCategory> = new BehaviorSubject(null);

  currentPage: BehaviorSubject<number> = new BehaviorSubject(1);

  perPage: BehaviorSubject<number> = new BehaviorSubject(50);

  totalPages: BehaviorSubject<number> = new BehaviorSubject(1);

  keyword: BehaviorSubject<string> = new BehaviorSubject('');

  loadingJobs: ReplaySubject<boolean> = new ReplaySubject(1);

  jobPosts: BehaviorSubject<JobPostItem[]> = new BehaviorSubject([]);

  constructor(
    private api: CareersClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  initialize(): void {
    this.api.getJobCategories().subscribe((res) => {
      this.jobCategories.next(res.categories);
    });

    this.selectedCategory.asObservable().subscribe((category) => {
      this.searchJobs();
    });

    this.route.queryParams.subscribe((params) => {
      if (params.keyword && this.keyword.getValue() !== params.keyword) {
        this.keyword.next(params.keyword);
      }
    });
  }

  searchJobs(): void {
    const cat = this.selectedCategory.getValue();
    this.loadingJobs.next(true);
    this.api.searchJobs(this.currentPage.getValue(), this.perPage.getValue(), cat ? cat.id : null).subscribe(
      (res) => {
        this.loadingJobs.next(false);
        this.jobPosts.next(res.items);
        this.totalPages.next(res.totalPages);
        this.currentPage.next(res.currentPage);
      },
      (e) => {
        this.loadingJobs.next(false);
        // TODO: handle error
      },
    );
  }

  searchKeyword(keyword: string): void {
    this.router.navigate([], {
      queryParams: {
        keyword,
      },
    });
  }

  getJobPost(jobPostId: string): Observable<JobPostDetails> {
    return this.api.getJobPost(jobPostId).pipe(
      map((response) => {
        return response.jobPost;
      }),
    );
  }
}
