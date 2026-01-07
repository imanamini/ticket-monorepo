import { Component, input, OnInit, signal } from '@angular/core';
import { ClaimModel } from '../../../../../equipment/api/models/claim/claim-models';
import { NgxListItemComponent } from '@digipay/ngx-list-item';
import { claimStatus } from '../../../../../../util/badge-color';
import { PersianTime } from '../../../../../../util/persian-time';
import { PersianTimeModel } from '../../../../../equipment/models/persian-date.model';
import { ModifiedClaimModel } from './modified-claim.model';

@Component({
  selector: 'history-claim-list',
  standalone: true,
  imports: [
    NgxListItemComponent
  ],
  templateUrl: './history-claim-list.component.html',
  styleUrl: './history-claim-list.component.scss'
})
export class HistoryClaimListComponent implements OnInit {
  claims = input.required<ClaimModel[]>();
  modifiedClaims = signal<ModifiedClaimModel[]>([]);

  protected readonly claimStatus = claimStatus;

  ngOnInit(): void {
    this.fillModifiedClaims();
  }

  fillModifiedClaims(): void {
    const tmpClaims: ModifiedClaimModel[] = [];
    this.claims().forEach(claim => tmpClaims.push({
      ...claim,
      subtitle: `${claim.selectedCover.title} . ${new PersianTime(claim.lastChangedAt).convert(PersianTimeModel.YYYY_MD)}`
    }));
    this.modifiedClaims.set(tmpClaims);
  }
}
