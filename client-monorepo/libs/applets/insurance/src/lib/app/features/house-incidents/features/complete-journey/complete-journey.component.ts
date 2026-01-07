import { Component, inject, OnInit, signal } from '@angular/core';
import { InsAlertComponent } from '../../../../components/ins-alert/ins-alert.component';
import { InsButtonComponent } from '../../../../components/ins-button/ins-button.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { InsButtonSizeEnum } from '../../../../data-access/enums/ins-button-size.enum';
import { InsButtonStyleEnum } from '../../../../data-access/enums/ins-button-style.enum';
import { Router } from '@angular/router';
import { InsuranceUrlsEnum } from '../../../../data-access/enums/insurance-urls.enum';
import { HouseIncidentsApiService } from '../../data-access/services/house-incidents-api.service';
import { BaseComponent } from '../../../../components/base/base.component';
import { QueryParamHouseIncidentEnum } from '../../data-access/enums/query-param-house-incident.enum';
import { DownloadService } from '../../../../data-access/services/download.service';
import { InsuranceTabEnum } from '../../../policy/data-access/enums/policy-list.enum';
import { MetricService } from '../../../../data-access/services/metric.service';

@Component({
  selector: 'complete-journey',
  standalone: true,
  imports: [
    InsAlertComponent,
    InsButtonComponent,
    NgxIcon
  ],
  templateUrl: './complete-journey.component.html',
  styleUrl: './complete-journey.component.scss'
})
export class CompleteJourneyComponent extends BaseComponent implements OnInit {
  isDownloading = signal<boolean>(false);
  private router = inject(Router);
  private apiHouseIncidentsService = inject(HouseIncidentsApiService);
  private downloadService = inject(DownloadService);
  private metricService = inject(MetricService);

  private applicationId: string | null = null;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.applicationId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamHouseIncidentEnum.ApplicationId);
  }

  downloadPolicy(): void {
    if (this.isDownloading()) {
      return;
    }
    this.isDownloading.set(true);
    this.metricService.sendMetric('HouseIncidentsDownloadPolicy', this.router.url, []);
    this.apiHouseIncidentsService.downloadPolicy(this.applicationId).subscribe({
      next: response => {
        void this.downloadService.download(response.body, 'application/pdf', 'policy-' + this.applicationId);
        this.isDownloading.set(false);
      }
    });
  }

  navigateToPolicyList(): void {
    this.router.navigate([InsuranceUrlsEnum.PolicyList], {
      queryParams: {
        type: InsuranceTabEnum.HOUSE_INCIDENT
      }
    });
  }
}
