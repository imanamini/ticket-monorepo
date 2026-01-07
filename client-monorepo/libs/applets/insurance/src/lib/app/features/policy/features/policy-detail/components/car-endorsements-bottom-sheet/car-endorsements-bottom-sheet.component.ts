import { Component, inject, OnInit, signal } from '@angular/core';
import {
  PolicyEndorsementModel
} from '../../../../../vehicle/data-access/models/application-form/policy-endorsement.model';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PolicyApiService } from '../../../../../vehicle/data-access/services/third-party/policy-api.service';

@Component({
  selector: 'car-endorsements-bottom-sheet',
  standalone: true,
  imports: [],
  templateUrl: './car-endorsements-bottom-sheet.component.html',
})
export class CarEndorsementsBottomSheetComponent implements OnInit {
  endorsements = signal<(PolicyEndorsementModel & { title: string })[]>([]);
  applicationFormId: string;

  private bottomSheetData = inject(MAT_BOTTOM_SHEET_DATA);
  policyApiService = inject(PolicyApiService);

  ngOnInit(): void {
    this.applicationFormId = this.bottomSheetData.data.applicationFormId;
    this.createEndorsementList(this.bottomSheetData.data.endorsements);
  }

  createEndorsementList(endorsementList: PolicyEndorsementModel[]): void {
    const list: (PolicyEndorsementModel & { title: string })[] = [];
    endorsementList.forEach((endorsement: PolicyEndorsementModel, index) => {
      list.push({
        ...endorsement,
        title: `الحاقیه شماره ${index + 1}`
      });
    });
    this.endorsements.set(list);
  }

  downloadEndorsement(endorsementId: string): void {
    this.policyApiService.downloadCarEndorsement(this.applicationFormId, endorsementId).subscribe({
      next: response => {
        window.open(response.result.url, '_blank');
      }
    });
  }
}
