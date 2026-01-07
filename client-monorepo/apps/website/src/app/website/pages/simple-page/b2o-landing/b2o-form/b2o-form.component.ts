import { Component, Input } from '@angular/core';

import { registrationForm } from '../../../../../api/clients/models/common/registrationForm';
import { ContactForm } from '../../../../../api/clients/models/templates/contact-us/contact-form';
import { CustomB2oFormComponent } from './custom-b2o-form/custom-b2o-form.component';

@Component({
  selector: 'app-b2o-form',
  standalone: true,
  templateUrl: './b2o-form.component.html',
  imports: [CustomB2oFormComponent],
  styleUrls: ['./b2o-form.component.scss'],
})
export class B2oFormComponent {
  @Input()
  b2oRegisterForm!: ContactForm;

  @Input()
  registrationForm!: registrationForm;
}
