import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';

@Component({
  selector: 'app-early-settlement-provider-verification-rejected',
  templateUrl: './early-settlement-provider-verification-rejected.component.html',
  styleUrls: ['./early-settlement-provider-verification-rejected.component.scss']
})
export class EarlySettlementProviderVerificationRejectedComponent implements OnInit {

  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
  }

  exit(): void {
    this.configService.exit();
  }
}
