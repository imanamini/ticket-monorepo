import { Component, inject, OnInit } from '@angular/core';
import { FlokiHeaderComponent } from '../../ui-component/floki-header/floki-header.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAlert } from '@digipay/ngx-alert';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ImeiPattern, OnlyEnFaArNumbersPattern } from '../../../../util/patterns';
import { InsuredPartiesService } from './services/insured-parties.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlokiRoutesEnum } from '../../enums/floki-routes.enum';
import { ImeiGuideComponent } from './partial/imei-guide/imei-guide.component';
import { ExtractIMEIComponent } from './partial/extract-imei/extract-imei.component';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { ApplicationFormService } from '../../services/application-form.service';
import { BaseComponent } from '../../../../components/base/base.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';

@Component({
  selector: 'complete-info',
  standalone: true,
  imports: [
    FlokiHeaderComponent,
    NgxButtonComponent,
    NgxAlert,
    FormsModule,
    ReactiveFormsModule,
    UiFormFieldBuilderModule,
    ExtractIMEIComponent,
  ],
  templateUrl: './complete-info.component.html',
  styleUrl: './complete-info.component.scss',
})
export class CompleteInfoComponent extends BaseComponent implements OnInit {
  insuredPartiesService = inject(InsuredPartiesService);
  messageService = inject(MessageService);
  applicationFormService = inject(ApplicationFormService);
  activatedRoute = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  bottomSheetService = inject(BottomSheetService);
  router = inject(Router);
  private formId: string;
  form: FormGroup;

  ngOnInit(): void {
    this.readQueryParam();
    this.generateForm();
    this.getApplicationFormOfUser();
  }

  clickAction(): void {
    super.addSubscription(
      this.bottomSheetService
        .open(
          BottomSheetBoxComponent,
          {
            component: ImeiGuideComponent,
            name: 'ImeiGuide',
          },
          { fullPage: true },
        )
        .afterDismissed()
        .subscribe({}),
    );
  }

  readQueryParam(): void {
    this.formId = this.activatedRoute.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
  }

  generateForm(): void {
    this.form = this.formBuilder.group({
      assetName: new FormControl('', [Validators.required]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      serialNumber: new UntypedFormControl('', [Validators.required, Validators.pattern(ImeiPattern)]),
      nationalCode: new FormControl('', [
        Validators.required,
        Validators.pattern(OnlyEnFaArNumbersPattern),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
    });
  }

  handleSubmitInfo(): void {
    if (this.form.valid) {
      const subscription = this.insuredPartiesService.patchInsuredParties(this.formId, this.form.value).subscribe({
        next: () => {
          this.router
            .navigate([FlokiRoutesEnum.Floki, FlokiRoutesEnum.UploadImageDevice], {
              queryParams: {
                [QueryParamsEnum.ApplicationId]: this.formId,
              },
            })
            .then();
        },
        error: (e) => {
          // this.messageService.showErrorInFloki(e);
        },
      });
      super.addSubscription(subscription);
    }
  }

  goToExitFloki(): void {
    this.router
      .navigate([FlokiRoutesEnum.Floki, FlokiRoutesEnum.ExitFloki], {
        queryParams: {
          [QueryParamsEnum.ApplicationId]: this.formId,
        },
      })
      .then();
  }

  private getApplicationFormOfUser(): void {
    const subscription = this.applicationFormService.getDraftsWithInterceptor(this.formId).subscribe({
      next: (res) => {
        this.form.patchValue({
          assetName: res.result.insuredAssetName,
          firstName: res.result.insuredPartyFirstName,
          lastName: res.result.insuredPartyLastName,
          serialNumber: res.result.insuredAssetSerialNumber,
          nationalCode: res.result.insuredPartyNationalCode,
        });
      },
      error: (e) => {},
    });
    super.addSubscription(subscription);
  }
}
