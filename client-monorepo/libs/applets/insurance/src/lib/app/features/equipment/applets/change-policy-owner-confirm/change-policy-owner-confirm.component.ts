import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EEIRegisterModel } from '../../api/models/EEI-register.model';
import { KeyValuePair } from '../../models/utility.model';
import { AuthService } from '../../../auth/service/auth.service';
import { UiButtonComponent } from '../../../../components/ui-button/ui-button/ui-button.component';
import { PolicyGeneralInfoComponent } from '../policy-general-info/policy-general-info.component';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { PolicyModel } from '../../api/models/policy/policy.model';

@Component({
  selector: 'change-policy-owner-confirm',
  templateUrl: './change-policy-owner-confirm.component.html',
  styleUrls: ['./change-policy-owner-confirm.component.scss'],
  standalone: true,
  imports: [NgIf, PolicyGeneralInfoComponent, NgFor, UiButtonComponent, NgStyle]
})

export class ChangePolicyOwnerConfirmComponent implements OnInit {
  templateReady = false;
  transferTo: KeyValuePair [];
  @Input() policy: PolicyModel;
  @Input() newPerson: EEIRegisterModel;
  @Output() submittedEvent = new EventEmitter();
  @Output() closeEvent = new EventEmitter();

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.newPerson ? this.fullUserData() : this.getUserData();
  }

  close(): void {
    this.closeEvent.emit();
  }

  getUserData(): void {
    this.authService.userInfo().subscribe(res => {
      this.newPerson = {...res.data.identity};
      this.fullUserData();
    });
  }

  fullUserData(): void {
    this.transferTo = [
      {
        key: 'نام و نام خانوادگی بیمه گزار جدید',
        value: `${this.newPerson.firstName} ${this.newPerson.lastName}`
      }, {
        key: 'کد ملی',
        value: this.newPerson.nationalCode
      }, {
        key: 'موبایل',
        value: this.newPerson.mobile
      },
    ];
    this.templateReady = true;
  }

  submitted(): void {
    this.submittedEvent.emit(this.newPerson);
  }
}
