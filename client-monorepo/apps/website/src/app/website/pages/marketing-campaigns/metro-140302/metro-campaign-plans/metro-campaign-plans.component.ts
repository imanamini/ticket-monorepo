import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';

@Component({
  selector: 'app-metro-campaign-plans',
  templateUrl: './metro-campaign-plans.component.html',
  styleUrls: ['./metro-campaign-plans.component.scss'],
  standalone: true,
  imports: [NgOptimizedImage, RouterLink, UiButtonComponent, UiIconDirective],
})
export class MetroCampaignPlansComponent implements OnInit {
  queryParams: any;
  staticParams = {
    utm_campaign: 'buynowcheque',
    utm_term: '0302',
  };
  queryObject: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.queryParams = { ...params, ...this.staticParams };
    });

    this.queryObject = new URLSearchParams();
    for (const key in this.queryParams) {
      this.queryObject.set(key, this.queryParams[key]);
    }
  }
}
