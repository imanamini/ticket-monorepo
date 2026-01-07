import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetSettlementDetailTransformedResponse
} from '../../../api/clients/early-settlement/response-models/get-settlement-detail.response';
import { ConfigService } from '../../../services/config.service';
import { EarlySettlementApiService } from '../../../api/clients/early-settlement/early-settlement-api.service';
import { MAT_DIALOG_DATA,  MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-early-settlement-detail-dialog',
  templateUrl: './early-settlement-detail-dialog.component.html',
  styleUrls: ['./early-settlement-detail-dialog.component.scss']
})
export class EarlySettlementDetailDialogComponent implements OnInit {

  detail?: GetSettlementDetailTransformedResponse;
  trackingCode: string = '';
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EarlySettlementDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: {
      trackingCode: string
    },
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private earlySettlementApiService: EarlySettlementApiService
  ) {
    this.trackingCode = dialogData.trackingCode;
  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.loading = true;
    this.earlySettlementApiService.getDetail(this.trackingCode).subscribe(response => {
      this.detail = response;
      this.loading = false;
    }, () => {
      this.close();
    });

  }

  close(): void {
    this.dialogRef.close();
  }

  onBack() {
    this.dialogRef.close();
  }
}
