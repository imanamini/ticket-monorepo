import { Component, computed, input, OnInit } from '@angular/core';
import { ClaimModel } from '../../../equipment/api/models/claim/claim-models';
import { NgClass } from '@angular/common';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { PersianTime } from '../../../../util/persian-time';
import { PersianTimeModel } from '../../../equipment/models/persian-date.model';
import { claimStatus } from '../../../../util/badge-color';

@Component({
  selector: 'claim-card',
  standalone: true,
  imports: [
    NgClass,
    NgxBadgeModule
  ],
  templateUrl: './claim-card.component.html',
  styleUrl: './claim-card.component.scss'
})
export class ClaimCardComponent implements OnInit {
  claim = input.required<ClaimModel>();
  statusColor = computed(() => {
    return claimStatus(this.claim());
  });
  lastChangedAt: string;

  ngOnInit(): void {
    this.lastChangedAt = new PersianTime(this.claim().lastChangedAt).convert(PersianTimeModel.YYYY_M_D);
  }
}
