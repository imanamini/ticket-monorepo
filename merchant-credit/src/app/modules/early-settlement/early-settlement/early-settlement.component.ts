import { Component, OnInit } from '@angular/core';
import { EarlySettlementApiService } from '../../../api/clients/early-settlement/early-settlement-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { ConfigService } from '../../../services/config.service';
import {
  GetSettlementDetailTransformedResponse
} from '../../../api/clients/early-settlement/response-models/get-settlement-detail.response';
import { SettlementStatus } from '../../../api/clients/early-settlement/basic-models/settlement-status';

@Component({
  selector: 'app-early-settlement',
  templateUrl: './early-settlement.component.html',
  styleUrls: ['./early-settlement.component.scss']
})
export class EarlySettlementComponent implements OnInit {

  trackingCode: string = '';
  loading: boolean = false;

  settlementStatusEnum = SettlementStatus;
  detail?: GetSettlementDetailTransformedResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private configService: ConfigService,
    private earlySettlementApiService: EarlySettlementApiService
  ) {

  }

  ngOnInit(): void {
    const ticket = this.activatedRoute.snapshot.queryParams.ticket;
    this.trackingCode = this.activatedRoute.snapshot.queryParams.trackingCode;
    if (ticket && this.trackingCode) {
      this.storageService.setTicket(ticket);
      this.getData();
    } else {
      this.router.navigateByUrl('/early-settlement/no-ticket');
    }
  }

  getData(): void {
    this.loading = true;
    this.getDetailData();
  }

  getDetailData(): void {
    this.earlySettlementApiService.getDetail(this.trackingCode).subscribe(response => {
      this.detail = response;
      const businessSettlementUrl = response.businessSettlementUrl;
      sessionStorage.setItem('businessUrl', businessSettlementUrl);
      this.loading = false;
    });
  }

  onBack() {
    this.configService.exit();
  }
}
