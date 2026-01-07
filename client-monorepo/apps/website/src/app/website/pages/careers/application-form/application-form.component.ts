import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CareersClient } from '../../../../api/clients/careers-client';
import { ApplicationReceivedResponse } from '../../../../api/clients/models/hr/application-received.response';
import { FormFieldOption } from '../../../../ui/ui-components/form-field-builder/models/form-field-option.interface';
import { Observable } from 'rxjs';
import { convertNonEnglishDigits } from '@digipay/strings';
import { UiFormHintComponent } from '../../../../ui/ui-components/ui-hint-text/ui-form-hint/ui-form-hint.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgIf, NgFor } from '@angular/common';
import { FormFieldComponent } from '../../../../ui/ui-components/form-field-builder/form-field/form-field.component';

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  styleUrls: ['./application-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, NgIf, UiButtonComponent, NgFor, UiFormHintComponent],
})
export class ApplicationFormComponent implements OnChanges {
  @Input()
  jobPostId!: string;

  @Output()
  successfulApply = new EventEmitter<ApplicationReceivedResponse>();

  @Input()
  clearFormSignal = 0;

  @ViewChild('fileInput', {
    static: false,
  })
  input: ElementRef<HTMLInputElement>;

  selectedFile: File = null;

  form: FormGroup;

  errors = [];

  submitting = false;

  @Input()
  departmentOptions: FormFieldOption[] = [];

  constructor(
    private fb: FormBuilder,
    private api: CareersClient,
  ) {
    this.form = fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      enName: ['', [Validators.required, Validators.maxLength(50)]],
      mobile: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      linkedinProfile: ['', []],
      coverLetter: ['', [Validators.maxLength(1000)]],
      department: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.clearFormSignal && changes.clearFormSignal.currentValue) {
      this.clearForm();
    }
  }

  pickFile(): void {
    this.input.nativeElement.click();
  }

  onFileInputChange($event: Event): void {
    const element = $event.target as HTMLInputElement;
    this.selectedFile = element.files.item(0);
  }

  submitRequest(): void {
    if (this.submitting) {
      return;
    }
    this.errors = [];
    const formData = new FormData();
    formData.append('attachment', this.selectedFile);

    Object.keys(this.form.value).forEach((field) => {
      let val = this.form.value[field];
      val = convertNonEnglishDigits(val.trim());
      formData.append(field, val);
    });
    this.submitting = true;

    let request: Observable<any> = null;
    if (this.jobPostId) {
      request = this.api.submitApplication(this.jobPostId, formData);
    } else {
      // talent network
      request = this.api.joinTalentNetwork(formData);
    }

    request.subscribe(
      (res) => {
        this.submitting = false;
        this.successfulApply.emit(res);
      },
      (e) => {
        this.submitting = false;
        if (e.error && e.error.errors) {
          this.errors = e.error.errors;
        } else {
          if (e?.error?.info?.message) {
            this.errors = [e?.error?.info?.message];
          }
        }
      },
    );
  }

  private clearForm(): void {
    this.form.patchValue({
      name: '',
      enName: '',
      mobile: '',
      email: '',
      linkedinProfile: '',
      coverLetter: '',
      department: '',
    });
  }
}
