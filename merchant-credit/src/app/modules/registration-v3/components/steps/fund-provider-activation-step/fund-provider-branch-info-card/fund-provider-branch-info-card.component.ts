import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BranchData } from '../../../../../../api/clients/registration-v3/basic-models/branch-info.model';

@Component({
  selector: 'app-fund-provider-branch-info-card',
  templateUrl: './fund-provider-branch-info-card.component.html',
  styleUrls: ['./fund-provider-branch-info-card.component.scss']
})
export class FundProviderBranchInfoCardComponent implements OnInit {

  @Input() branchInfo!: BranchData;
  @Output() cardClicked = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  clickCard(branchInfo: any): void {
    this.cardClicked.emit(branchInfo);
  }
}
