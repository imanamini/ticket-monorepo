import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {CareersService} from '../careers.service';
import {SeoService} from '../../../services/seo.service';
import {PageClient} from '../../../../api/clients/page-client';

import {BaseLayoutComponent} from '../../../layout/base-layout/base-layout.component';
import {CareersHeaderComponent} from "./careers-header/careers-header.component";
import {OrganizationValuesComponent} from "./organization-values/organizationValues.component";
import {DigipayBenefitComponent} from "./digipay-benefit/digipay-benefit.component";
import {careersTemplateData} from "../../../../api/clients/models/templates/careers/careers-template-date";
import {JoinFlowComponent} from "./join-flow/join-flow.component";

@Component({
  selector: 'app-careers-home',
  templateUrl: './careers-home.component.html',
  styleUrls: ['./careers-home.component.scss'],
  standalone: true,
  imports: [BaseLayoutComponent, CareersHeaderComponent, OrganizationValuesComponent, DigipayBenefitComponent, JoinFlowComponent],
})
export class CareersHomeComponent implements OnInit {
  templateData = signal<careersTemplateData>(<careersTemplateData>{});

  constructor(
    private seo: SeoService,
    private pageClient: PageClient,
  ) {}

  ngOnInit(): void {
    this.pageClient.getPage('p', 'careers').subscribe((res) => {
      this.seo.setGlobalMetaTagsFromPage(res.page);
      this.templateData.set(res.page.templateData);
    });
  }
}
