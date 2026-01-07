import { Component, Input } from '@angular/core';
import { ContactForm } from '../../../../../api/clients/models/templates/contact-us/contact-form';
import { registrationForm } from '../merchant-register-response';
import { CustomMerchantRegisterFormComponent } from './custom-merchant-register-form/custom-merchant-register-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-merchant-register-form',
  templateUrl: './merchant-register-form.component.html',
  standalone: true,
  styleUrls: ['./merchant-register-form.component.scss'],
  imports: [CustomMerchantRegisterFormComponent, NgIf],
})
export class MerchantRegisterFormComponent {
  @Input()
  merchantRegisterForm!: ContactForm;

  @Input()
  registrationForm!: registrationForm;
}
