import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { ProfileInterface, UserDataService } from '@client-monorepo/common/user';
import { MessageService } from '@client-monorepo/common/utilities';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCalloutComponent } from '@digipay/ngx-callout';
import { NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import moment from 'jalali-moment';
import { PageLoadingComponent } from '../../../components/page-loading/page-loading.component';
import { PageLoadingService } from '../../../components/page-loading/page-loading.service';
import { DigiCardIssuanceService } from '../../../data-access/services/digi-card-issuance.service';
import { finalize, take, timeout } from 'rxjs';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'digipay-card-applet-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    PageLayoutComponent,
    PipesModule,
    NgxDividerComponent,
    NgxButtonComponent,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    PageLoadingComponent,
    NgxCalloutComponent,
    NgxAppBarComponent,
  ],
  providers: [PageLoadingService],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PersonalInfoComponent implements OnInit {
  //TODO ask about cdr and form issue on updating
  router = inject(Router);
  userService = inject(UserDataService);
  pageLoadingService = inject(PageLoadingService);
  issuanceService = inject(DigiCardIssuanceService);
  messageService = inject(MessageService);
  backHandler = inject(BackHandlerService);
  private destroyRef = inject(DestroyRef);

  userData = signal<ProfileInterface | null>(null);
  changeDetectorRef = inject(ChangeDetectorRef);
  birthdateIsReadonly = computed(() => !!this.issuanceService.addressDetail()?.birthDate);
  today = moment().locale('fa');
  form = new FormGroup({
    nationalCode: new FormControl<string | null>(null, [NgxFormValidator.nationalCodeValidator, Validators.minLength(10)]),
    postalCode: new FormControl<number | null>(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^[0-9]*$'),
    ]),
    birthDate: new FormControl<number | null>(null, [Validators.required]),
  });
  ngOnInit() {
    this.initializeUserDetail();
  }
  private initializeUserDetail() {
    if (this.issuanceService.addressDetail()) {
      this.form.controls.nationalCode.setValue(this.issuanceService.addressDetail()!.nationalCode);

      if (this.issuanceService.addressDetail()!.birthDate) {
        this.form.controls.birthDate.setValue(new Date(this.issuanceService.addressDetail()!.birthDate).getTime());
      }
      if (!this.form.controls.postalCode.value && this.issuanceService.addressDetail()!.postalCode) {
        this.form.controls.nationalCode.setValue(this.issuanceService.addressDetail()!.postalCode);
      }
    }
  }
  setDateInputBoundaries() {
    const startYear = new Date();
    startYear.setFullYear(startYear.getFullYear() - 70);

    const endYear = new Date();
    endYear.setFullYear(endYear.getFullYear() - 18);
  }
  birthDateValidator(control: AbstractControl): null | ValidationErrors {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    let date = moment(value);
    date = date.locale('fa');
    const diff = this.today.locale('en').diff(date.locale('en'), 'years');
    return diff >= 18 ? null : { invalidBirthDate: true };
  }
  onSubmitForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.pageLoadingService.showLoading();

    this.issuanceService
      .setIdentity({
        postalCode: this.form.value.postalCode!.toString(),
        birthDate: this.form.value.birthDate!,
      })
      .pipe(
        timeout(10000),
        finalize(() => {
          this.pageLoadingService.hideLoading();
        }),
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const { result, ...identity } = res;
          this.issuanceService.addressDetail.set(identity);
          this.router.navigateByUrl('/card/issuance');
        },
        error: (err) => {
          this.messageService.showErrorMessage(err?.error?.result?.message ?? 'خطا در انجام عملیات!');
          if (err.status === HttpStatusCode.UnprocessableEntity && err.error.result.status === 18607) {
            this.router.navigateByUrl('/card/issuance');
          }
        },
      });
  }
  goBack() {
    this.backHandler.setCustomBackUrl('/transactions', true);
    this.backHandler.goBack();
  }
}
