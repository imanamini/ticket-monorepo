import { Component, OnInit, signal } from '@angular/core';
import { RegisterDamageStateManagementService } from '../../services/register-damage-state-management.service';
import { CoverageModel } from '../../../../../equipment/api/models/coverage/coverage-multiselection.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import {
  CoverageMultiSelectionComponent
} from '../../partial/coverage-multi-selection/coverage-multi-selection.component';
import { Location } from '@angular/common';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'register-damage-step-one',
  templateUrl: './register-damage-step-one.component.html',
  standalone: true,
  imports: [
    CoverageMultiSelectionComponent,
    ActionButtonsComponent
  ],
  styleUrls: ['./register-damage-step-one.component.scss']
})
export class RegisterDamageStepOneComponent implements OnInit {
  policyDraftNumber: number;
  policyId = signal<string>(null);

  constructor(
    private stateManagement: RegisterDamageStateManagementService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.policyDraftNumber = this.activatedRoute.snapshot.queryParams.policyDraftNo;
    this.stateManagement.setPolicyDraftNo(this.policyDraftNumber);
    this.policyId.set(this.activatedRoute.snapshot.queryParams.policyId);
  }

  coverageSelectedListEvent(list: CoverageModel): void {
    this.stateManagement.selectCoverage(list.identifier);
  }

  onSave(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/step-two`], {
      queryParams: {
        policyDraftNo: this.policyDraftNumber
      }, queryParamsHandling: 'merge',
    }).then();
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }

}
