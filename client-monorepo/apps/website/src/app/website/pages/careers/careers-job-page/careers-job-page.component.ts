import { Component, OnInit } from '@angular/core';
import { CareersService } from '../careers.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobPostDetails } from '../../../../api/clients/models/hr/job-post-details';
import { ApplicationReceivedResponse } from '../../../../api/clients/models/hr/application-received.response';
import { ApplicationFormComponent } from '../application-form/application-form.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf } from '@angular/common';
import { BaseLayoutComponent } from '../../../layout/base-layout/base-layout.component';

@Component({
  selector: 'app-careers-job-page',
  templateUrl: './careers-job-page.component.html',
  styleUrls: ['./careers-job-page.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, NgIf, RouterLink, UiButtonComponent, ApplicationFormComponent],
})
export class CareersJobPageComponent implements OnInit {
  jobPost: JobPostDetails;

  displayingApplySection = false;

  successfulApplicationResponse: ApplicationReceivedResponse = null;

  constructor(
    private service: CareersService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.service.getJobPost(params.id).subscribe((jobPost) => {
          this.jobPost = jobPost;
        });
      }
    });

    this.route.queryParams.subscribe((queryParams) => {
      if (!this.displayingApplySection) {
        if (queryParams.apply === '1') {
          this.displayingApplySection = true;
        }
        if (queryParams.apply === '2') {
          this.router.navigate([], {
            queryParams: {
              apply: null,
            },
          });
        }
      }
    });
  }

  applyForThisJob(): void {
    this.router.navigate([], {
      queryParams: {
        apply: 1,
      },
    });
  }

  onSuccessfulApply($event: ApplicationReceivedResponse): void {
    this.successfulApplicationResponse = $event;
    this.router.navigate([], {
      queryParams: {
        apply: 2,
      },
    });
  }
}
