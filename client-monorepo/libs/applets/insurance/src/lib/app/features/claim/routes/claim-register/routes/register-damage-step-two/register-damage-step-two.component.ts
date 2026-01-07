import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RegisterDamageStateManagementService } from '../../services/register-damage-state-management.service';
import moment from 'jalali-moment';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { MessageService } from '@client-monorepo/common/utilities';
import { ActionButtonsComponent } from '../../../../../../components/action-buttons/action-buttons.component';
import { Router } from '@angular/router';
import { ClaimApiService } from '../../../../../../data-access/services/claim/claim-api.service';
import { Location } from '@angular/common';
import { INSURANCE_APP_PREFIX } from '../../../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'register-damage-step-two',
  templateUrl: './register-damage-step-two.component.html',
  standalone: true,
  imports: [
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    ActionButtonsComponent
  ],
  styleUrls: ['./register-damage-step-two.component.scss']
})
export class RegisterDamageStepTwoComponent implements OnInit {

  form: UntypedFormGroup = new UntypedFormGroup({
    accidentAt: new UntypedFormControl(+new Date(), Validators.required),
    story: new UntypedFormControl('')
  });

  constructor(
    private stateManagement: RegisterDamageStateManagementService,
    private messageService: MessageService,
    private claimApiService: ClaimApiService,
    private location: Location,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getFormChanges();
  }

  getFormChanges(): void {
    this.form.valueChanges.subscribe(onchange => {
      const start = moment(Number(this.stateManagement.getAllInfo().policyStartAt)).format('YYYY/MM/DD');
      const selected = moment(onchange.accidentAt).format('YYYY/MM/DD');
      if (start > selected) {
        this.form.patchValue({accidentAt: ''});
        return this.messageService.showInfoMessage('زمان حادثه مربوط به قبل از ثبت بیمه میباشد');
      }
      if (this.form.value.accidentAt && this.form.value.story) {
        this.stateManagement.accidentDetail(this.form.value.accidentAt, this.form.value.story);
      }
    });
  }

  onSave(): void {
    const coverage = this.stateManagement.getAllInfo().selectedCoverIdentifier;
    if (coverage !== 'Stealing') {
      this.claimApiService.addClaim(this.stateManagement.getAllInfo()).subscribe(res => {
        this.goToSpecificPage('step-four');
        this.stateManagement.setClaimCaseNo(res.data?.claimCaseNo);
      }, error => {
        this.messageService.showErrorIfExists(error);
      });
    } else {
      this.goToSpecificPage('step-three');
    }
  }

  goToSpecificPage(state: string): void {
    this.router.navigate([`${INSURANCE_APP_PREFIX}/claim/register/${state}`], {
      queryParams: {}, queryParamsHandling: 'merge',
    }).then();
  }

  handleDeActiveButtonClicked(): void {
    this.location.back();
  }
}
