import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageDataService } from '../../../../services/page-data.service';
import { BaseLayoutComponent } from '../../../../layout/base-layout/base-layout.component';
import { NgIf } from '@angular/common';
import { CreditCampaignTimerComponent } from '../../../credit/credit-campaign/credit-campaign-timer/credit-campaign-timer.component';

@Component({
  selector: 'app-digijet',
  templateUrl: './digijet.component.html',
  styleUrls: ['./digijet.component.scss'],
  imports: [BaseLayoutComponent, NgIf, CreditCampaignTimerComponent],
  standalone: true,
})
export class DigijetComponent implements OnInit {
  creditCampaignPage!: any;
  loaded = false;

  constructor(
    private route: ActivatedRoute,
    private pageDataService: PageDataService,
  ) {}

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.pageDataService.getPageData('campaigns', segments[0].path).subscribe((res) => {
        this.creditCampaignPage = res.page;
        this.loaded = true;
      });
    });
  }
}
