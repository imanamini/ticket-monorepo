import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { PolicyApiService } from '../../../../../../data-access/services/policy/policy-api.service';
import { NgForOf } from '@angular/common';
import {
  InsurtechCollectionImageCdnComponent
} from '../../../../../../components/insurtech-collection-image-cdn/insurtech-collection-image-cdn.component';
import { CoverageModel } from '../../../../../equipment/api/models/coverage/coverage-multiselection.model';

@Component({
  selector: 'coverage-multi-selection',
  templateUrl: './coverage-multi-selection.component.html',
  standalone: true,
  imports: [
    NgForOf,
    InsurtechCollectionImageCdnComponent
  ],
  styleUrls: ['./coverage-multi-selection.component.scss']
})
export class CoverageMultiSelectionComponent implements OnInit {

  coverageList: CoverageModel[];

  selectedCoverage: CoverageModel = {
    description: '',
    id: '',
    identifier: 'fire',
    title: '',
    selected: false
  };

  policyDraftNo = input<string>();

  @Output()
  coverageSelectedList = new EventEmitter<CoverageModel>();

  constructor(
    private policyApiService: PolicyApiService) {
  }

  ngOnInit(): void {
    this.getCoverageList();
  }

  getCoverageList(): void {
    queueMicrotask(() => {
      this.policyApiService.getCoverageList(this.policyDraftNo()).subscribe(res => {
        this.coverageList = res.data.map(coverage => {
          coverage.selected = false;
          return coverage;
        });
      });
    });
  }

  selectCoverage(coverage: CoverageModel, index: number): void {
    this.selectedCoverage = coverage;
    this.coverageSelectedList.emit(this.selectedCoverage);
  }
}
