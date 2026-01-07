import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ScannerApiService } from '../../data-access/services/scanner-api.service';
import { QrDetectResponseModel } from '../../data-access/models/qr-detected-response.model';
import { QrDetectBodyModel } from '../../data-access/models/qr-detect-body-model';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'scanner-applet-acceptor-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiFormFieldBuilderModule, NgxButtonComponent],
  templateUrl: './scanner-acceptor-code.component.html',
  styleUrl: './scanner-acceptor-code.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerAcceptorCodeComponent {
  form: FormGroup;
  processing = signal(false);
  errorMessageMapper = {
    inquiryId: 'این فیلد الزامی است',
  };

  constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private scannerApiService: ScannerApiService,
    private bottomSheetService: NgxBottomSheetService,
    private messageService: MessageService,
  ) {
    this.form = this.formBuilder.group({
      acceptorCode: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  onSubmit(): void {
    this.processing.set(true);
    const data: QrDetectBodyModel = {
      content: this.form.controls['acceptorCode'].value,
      type: 2,
    };
    this.scannerApiService.checkQrTypeApi(data).subscribe({
      next: (result: QrDetectResponseModel) => {
        this.router
          .navigate(['taxi-pay'], {
            queryParams: {
              terminalId: result.detail.terminalId,
              institutionId: result.detail.institutionId,
            },
          })
          .then();
        this.bottomSheetService.closeBottomSheet();
      },
      error: (error) => {
        this.processing.set(false);
        this.messageService.showErrorOfErrorResponse(error);
        this.form.controls['acceptorCode'].setErrors({
          serverError: true,
        });
        this.form.updateValueAndValidity();
      },
    });
  }
}
