import { Component, inject, signal } from '@angular/core';
import {
  PolicyEndorsementModel
} from '../../../../../vehicle/data-access/models/application-form/policy-endorsement.model';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { PolicyApiService } from '../../../../../vehicle/data-access/services/third-party/policy-api.service';

@Component({
  selector: 'motor-endorsements-bottom-sheet',
  standalone: true,
  imports: [],
  templateUrl: './motor-endorsements-bottom-sheet.component.html',
})
export class MotorEndorsementsBottomSheetComponent {
  endorsements = signal<(PolicyEndorsementModel & { title: string })[]>(null);
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
    this.policyApiService.downloadMotorEndorsement(this.applicationFormId, endorsementId).subscribe({
      next: response => {
        window.open(response.result.url, '_blank');
      }
    });
  }
}
