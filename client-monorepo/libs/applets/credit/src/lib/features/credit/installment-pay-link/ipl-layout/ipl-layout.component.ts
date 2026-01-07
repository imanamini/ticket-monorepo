import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { IplService } from '../services/ipl.service';
import { CreditPageLoadingComponent } from '../../components/credit-page-loading/credit-page-loading.component';
import { InstallmentRefererShortKey } from '../../data-access/models/credit/installment/installment-referer.model';

@Component({
  selector: 'app-ipl-layout',
  standalone: true,
  imports: [CreditPageLoadingComponent, RouterOutlet],
  templateUrl: './ipl-layout.component.html',
  styleUrls: ['./ipl-layout.component.scss'],
})
export class IplLayoutComponent implements OnInit {
  constructor(
    public iplService: IplService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    const referer = this.route.snapshot.queryParamMap.get(InstallmentRefererShortKey); // Referer shows from which referer user came
    referer && this.iplService.setReferer(referer);
    this.iplService.setUuid(uuid);
    this.iplService.getInformation();
  }
}
