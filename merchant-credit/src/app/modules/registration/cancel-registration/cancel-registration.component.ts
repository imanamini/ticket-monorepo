import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormFieldOption } from '@digipay/ui-form-field-builder';
import { ConfigService } from '../../../services/config.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { RegistrationApiService } from '../../../api/clients/registration/registration-api.service';

@Component({
  selector: 'app-cancel-registration',
  templateUrl: './cancel-registration.component.html',
  styleUrls: ['./cancel-registration.component.scss']
})
export class CancelRegistrationComponent implements OnInit {

  @Input()
  creditId: string = '';

  @Output()
  back = new EventEmitter();
  reasonsOptions: FormFieldOption[] = [];
  gettingData: boolean = false;
  sendingData: boolean = false;
  showCanceledMessage: boolean = false;
  form: UntypedFormGroup;

  constructor(
    private configService: ConfigService,
    private formBuilder: UntypedFormBuilder,
    private registrationApiService: RegistrationApiService,
  ) {
    this.form = this.formBuilder.group({
      uid: [null, [Validators.required]],
      message: [null]
    });
  }

  ngOnInit(): void {
    this.gettingData = true;
    this.configService.getConfig().subscribe(config => {
      this.reasonsOptions = config.cancelReasons.map(item => ({
        title: item.reason,
        value: item.uid
      }));
    });
  }

  submitForm() {
    if (this.form.invalid) {
      return;
    }
    this.sendingData = true;
    this.registrationApiService.cancel(this.creditId, this.form.value.uid, this.form.value.message).subscribe(() => {
      this.sendingData = false;
      this.showCanceledMessage = true;
    });

  }
}
