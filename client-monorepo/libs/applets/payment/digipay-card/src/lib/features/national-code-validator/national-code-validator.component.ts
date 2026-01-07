import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { Router } from '@angular/router';
import { PageLoadingService } from '../../components/page-loading/page-loading.service';
import { PageLoadingComponent } from '../../components/page-loading/page-loading.component';
import { DigiCardIssuanceService } from '../../data-access/services/digi-card-issuance.service';
import { MessageService } from '@client-monorepo/common/utilities';
import { finalize } from 'rxjs';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { UserDataService } from '@client-monorepo/common/user';

@Component({
  selector: 'digipay-card-applet-national-code-validator',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    NgxCalloutComponent,
    NgxButtonComponent,
    PageLoadingComponent,
    NgxAppBarComponent,
  ],
  templateUrl: './national-code-validator.component.html',
  styleUrl: './national-code-validator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NationalCodeValidatorComponent implements OnInit {
  router = inject(Router);
  loadingService = inject(PageLoadingService);
  digiCardIssuanceService = inject(DigiCardIssuanceService);
  backHandler = inject(BackHandlerService);
  messageService = inject(MessageService);
  userDataService = inject(UserDataService);
  cdr=inject(ChangeDetectorRef);
  form = new FormGroup({
    nationalCode: new FormControl<string | null>(null, [NgxFormValidator.nationalCodeValidator, Validators.minLength(10)]),
  });

  ngOnInit(): void {
    this.checkIssuanceDetailExistence();
    this.autoFillNationalCode();
  }
  checkIssuanceDetailExistence() {
    if (!this.digiCardIssuanceService.issuanceDetail()) {
      this.router.navigateByUrl('/transactions');
    }
  }
  autoFillNationalCode() {
    this.userDataService.getUserDetail().then((res) => {
      if (res?.nationalCode && !this.form.controls.nationalCode.value) {
        this.form.setValue({ nationalCode: res.nationalCode });
        this.form.controls.nationalCode.updateValueAndValidity();
        this.cdr.markForCheck()
      }
    });
  }
  onSubmitForm() {
    if (this.form.valid) {
      this.loadingService.showLoading();
      this.digiCardIssuanceService
        .initIssuanceProcess(this.form.value.nationalCode!)
        .pipe(
          finalize(() => {
            this.loadingService.hideLoading();
          }),
        )
        .subscribe({
          next: (res) => {
            if (res) {
              this.router.navigateByUrl('/card/issuance');
            }
          },
          error: (err) => {
            this.messageService.showErrorMessage(err?.error?.result?.message);
            if (err?.error?.result?.status === 18514) {
              this.router.navigateByUrl('/transactions');
            }
          },
        });
    }
  }
  goBack() {
    this.backHandler.setCustomBackUrl('/transactions', true);
    this.backHandler.goBack();
  }
}
