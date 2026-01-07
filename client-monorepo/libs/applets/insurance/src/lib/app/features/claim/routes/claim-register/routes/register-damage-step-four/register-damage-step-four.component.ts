import { Component, OnInit } from '@angular/core';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { Router } from '@angular/router';
import { RegisterDamageStateManagementService } from '../../services/register-damage-state-management.service';
import { AddClaimModel } from '../../../../../equipment/api/models/claim/claim-models';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'register-damage-step-four',
  templateUrl: './register-damage-step-four.component.html',
  standalone: true,
  imports: [
    ActionButtonsComponent
  ],
  styleUrls: ['./register-damage-step-four.component.scss']
})
export class RegisterDamageStepFourComponent implements OnInit {

  constructor(private router: Router,
              private stateManagement: RegisterDamageStateManagementService
  ) {
  }

  claimData!: AddClaimModel;

  ngOnInit(): void {
    this.claimData = this.stateManagement.getAllInfo();
  }

  goToClaimList(): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/list`]).then();
  }

}
