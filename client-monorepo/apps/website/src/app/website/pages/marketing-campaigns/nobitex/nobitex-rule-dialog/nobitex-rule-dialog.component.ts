import { Component, Inject, OnInit } from '@angular/core';
import { LayoutService } from '../../../../services/layout.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import { NobitexCreditService } from '../../../../../api/clients/nobitex/nobitex-credit.service';
import { NobitexApiService } from '../../../../../api/clients/nobitex/nobitex-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NobitexError } from '../../../../../ui/models/nobitex/nobitex.error';
import { MessageService } from '@client-monorepo/common/utilities';
import { NobitexErrorComponent } from '../nobitex-error/nobitex-error.component';
import { NobitexLoadingComponent } from '../nobitex-loading/nobitex-loading.component';
import { NobitexNotResponseComponent } from '../nobitex-not-response/nobitex-not-response.component';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { delay, of, Subscription } from 'rxjs';
import { nobitexError } from '../../../../../api/clients/models/nobitex/nobitexError';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NobitexRulesComponent } from '../nobitex-rules/nobitex-rules.component';
import { UiScrollableViewComponent } from '../../../../../ui/ui-components/ui-scrollable-view/ui-scrollable-view.component';
import { NobitexFinalPlanViewComponent } from '../nobitex-final-plan-view/nobitex-final-plan-view.component';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-nobitex-rule-dialog',
  templateUrl: './nobitex-rule-dialog.component.html',
  styleUrls: ['./nobitex-rule-dialog.component.scss'],
  standalone: true,
  imports: [
    NobitexFinalPlanViewComponent,
    UiScrollableViewComponent,
    NobitexRulesComponent,
    ReactiveFormsModule,
    UiButtonComponent,
    UiIconDirective,
    NgxIcon,
  ],
})
export class NobitexRuleDialogComponent implements OnInit {
  form: UntypedFormGroup;
  interval;
  subscription: Subscription;

  ruleSections;
  finalAmount;
  installmentCount;
  lockAmount;
  image;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bottomSheetData: any,
    private dialogService: DialogBottomSheetService,
    protected nobitexCredit: NobitexCreditService,
    private nobitexApiService: NobitexApiService,
    private messageService: MessageService,
    private formBuilder: UntypedFormBuilder,
    private layoutService: LayoutService,
    private dialog: MatDialog,
  ) {
    this.subscription = this.layoutService.isMobile.subscribe((value) => {
      this.ruleSections = value ? this.bottomSheetData.ruleSections : this.dialogData.ruleSections;
      this.finalAmount = value ? this.bottomSheetData.finalAmount : this.dialogData.finalAmount;
      this.installmentCount = value ? this.bottomSheetData.installmentCount : this.dialogData.installmentCount;
      this.lockAmount = value ? this.bottomSheetData.lockAmount : this.dialogData.lockAmount;
      this.image = value ? this.bottomSheetData.image : this.dialogData.image;
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      isAccepted: [false, Validators.required],
    });
  }

  get disableBtn() {
    return this.form.get('isAccepted').value === false;
  }

  closeDialog(): void {
    this.dialogService.close(true);
  }

  submitCredit() {
    if (this.finalAmount * 1.32 > this.nobitexCredit.amount.value) {
      this.dialog.closeAll();
      const error: nobitexError = {
        title: `دارایی شما برای فعالسازی اعتبار انتخاب‌شده کافی نیست`,
        subtitle: 'لطفا دوباره درخواست بدهید ',
        icon: 'icon-error',
        actionTitle: 'درخواست دوباره',
      };
      this.nobitexCredit.error.next(error);
      this.openNobitexErrorDialog();
    } else {
      this.closeDialog();
      this.nobitexCredit.nobitexInput.period = this.installmentCount;
      this.nobitexCredit.nobitexInput.principal = this.finalAmount * 10;
      this.nobitexCredit.nobitexInput.lockAmount = this.lockAmount * 10; // convert toman to rial
      this.nobitexCredit.nobitexInput.planId = 'd90ff504-da74-41af-bf3d-c3f5cac1f038';
      this.nobitexCredit.nobitexInput.groupId = 'f5812f1b-65a7-440a-98b6-f0a0c6ea2fc2';

      this.dialogService.open(NobitexLoadingComponent, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '400px',
        width: '400px',
        fullHeightBottomSheet: true,
      });

      this.interval = setInterval(() => {
        if (this.nobitexCredit.progressValue.value >= 100) {
          clearInterval(this.interval);
          of('')
            .pipe(delay(1000))
            .subscribe({
              next: () => {
                this.dialogService.close({ success: true });
              },
            });
        } else {
          if (this.nobitexCredit.progressValue.value < 90) {
            this.nobitexCredit.progressValue.next(this.nobitexCredit.progressValue.value + 1);
          }
        }
      }, 10);

      return new Promise((resolve, reject) => {
        this.nobitexApiService.submitCreditReq(this.nobitexCredit.nobitexInput).subscribe(
          (response) => {
            this.nobitexCredit.progressValue.next(100);
            this.nobitexCredit.submittedNobitexCreit.next(true);
          },
          (error: HttpErrorResponse | any) => {
            this.dialogService.close();
            this.dialogService.open(NobitexNotResponseComponent, {
              maxWidth: '100vw',
              maxHeight: '100vh',
              height: '400px',
              width: '400px',
              fullHeightBottomSheet: true,
            });
            this.nobitexCredit.submittedNobitexCreit.next(false);

            if (error.error.info.message === NobitexError.Something_Went_Wrong.enMessage) {
              this.messageService.showErrorMessage(NobitexError.Something_Went_Wrong.faMessage);
            }
          },
        );
      });
    }
  }

  openNobitexErrorDialog() {
    this.dialogService.open(NobitexErrorComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      fullHeightBottomSheet: true,
      image: this.image,
    });
  }
}
