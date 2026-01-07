import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { C2cCardCredentialsFormComponent } from '../../components/card-credentials-bottom-sheet/c2c-card-credentials-form.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { IdentityMismatchBottomSheetComponent } from '../../components/identity-mismatch-bottom-sheet/identity-mismatch-bottom-sheet.component';
import { C2cMainService } from '../../data-access/services/c2c-main.service';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { C2cStateService } from '../../data-access/services/c2c-state.service';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { C2cTransferSummeryComponent } from '../../components/c2c-transfer-summery/c2c-transfer-summery.component';
import moment from 'jalali-moment';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { NgxSwitchComponent } from '@digipay/ngx-switch';
import { C2cStepsEnum, C2cStepsType } from '../../data-access/models/c2c-steps';

@Component({
  selector: 'c2c-applet-c2c-credentials-step',
  standalone: true,
  imports: [
    CommonModule,
    UiFormFieldBuilderModule,
    ReactiveFormsModule,
    FormsModule,
    PageLayoutComponent,
    C2cCardCredentialsFormComponent,
    NgxButtonComponent,
    C2cTransferSummeryComponent,
    DpIconComponent,
    NgxSwitchComponent,
  ],
  templateUrl: './c2c-credentials-step.component.html',
  styleUrls: ['./c2c-credentials-step.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class C2cCredentialsStepComponent implements OnInit {
  // View Children
  readonly cardCredentialsComponent = viewChild<C2cCardCredentialsFormComponent>('cardCredentialsComponent');

  // Injects
  private readonly c2cStateService = inject(C2cStateService);
  private readonly messageService = inject(MessageService);
  private readonly c2cMainService = inject(C2cMainService);
  private readonly bottomSheetService = inject(NgxBottomSheetService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // State
  readonly isLoadingPage = signal(true);
  readonly isTransferring = signal(false);
  readonly saveAsFrequentTransaction = signal(false);

  // Computed Properties
  readonly amount = computed(() => this.c2cStateService.amount());
  readonly isFromFrequentTransaction = computed(() => this.c2cStateService.isFromFrequentTransaction());
  readonly destCardProfileData = computed(() => this.c2cStateService.destCardProfileData());
  readonly unifiedDestinationCardData = computed(() => this.c2cStateService.unifiedDestinationCardData());
  readonly unifiedSourceCardData = computed(() => this.c2cStateService.unifiedSourceCardData());
  readonly form = computed(() => this.cardCredentialsComponent()?.getForm());
  readonly isConfigLoaded = computed(() => this.c2cStateService.isPaymentConfigLoaded());

  ngOnInit() {
    this.setConfig();
  }

  setConfig() {
    this.c2cMainService
      .amountConfig()
      .pipe(
        tap((config) => {
          if (config.trace) {
            this.c2cStateService.serverTraceCode.set(config.trace);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.c2cStateService.isPaymentConfigLoaded.set(true);
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
          this.goBack(C2cStepsEnum.SOURCE);
        },
      });
  }

  handleTransfer(): void {
    if (this.isTransferring() || !this.isConfigLoaded()) return;
    this.isTransferring.set(true);

    this.c2cMainService
      .processKycAndVerify()
      .pipe(
        switchMap(() => this.performCardTransfer()),
        switchMap((transferResponse) => this.handlePostTransferOperations(transferResponse)),
        catchError((error) => this.handleTransferError(error)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.isTransferring.set(false);
        },
        error: (error) => {
          this.isTransferring.set(false);
          this.handleFinalError(error);
        },
      });
  }

  private performCardTransfer() {
    const formValue = this.form()?.value;
    if (!formValue) {
      this.messageService.showErrorMessage('فرم اطلاعات کارت معتبر نیست');
      return throwError(() => new Error('Invalid form'));
    }

    const transferData = {
      ...formValue,
      expirationDate: moment(formValue.expirationDate).format('jYYYY/jMM'),
    };

    this.c2cStateService.isSavedAsFrequentTransaction.set(this.saveAsFrequentTransaction());

    return this.c2cMainService.cardTransfer(transferData);
  }

  private handlePostTransferOperations(transferResponse: any) {
    return this.registerDestinationCardIfNeeded().pipe(
      tap(() => this.c2cMainService.goToReceiptPage(transferResponse)),
      map(() => transferResponse),
    );
  }

  private handleTransferError(error: any) {
    return this.registerDestinationCardIfNeeded().pipe(switchMap(() => throwError(() => error)));
  }

  private handleFinalError(error: any): void {
    this.isLoadingPage.set(false);

    if (error.failedDialogueBox) {
      this.handleIdentityMismatchError(error.failedDialogueBox);
    } else {
      this.messageService.showErrorOfErrorResponse(error, 'مشکل در برقراری ارتباط با سرور');
    }
  }

  private handleIdentityMismatchError(dialogueData: any): void {
    this.bottomSheetService.openBottomSheet(IdentityMismatchBottomSheetComponent, {
      data: dialogueData,
    });

    this.bottomSheetService.onClose
      .pipe(
        tap(() => {
          const result = this.bottomSheetService.outputData();
          if (result?.url) {
            const feature = { url: result.url };
            this.router.navigate(['ext/view/simple-page'], { state: { feature } });
          } else {
            this.goBack(C2cStepsEnum.SOURCE);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private registerDestinationCardIfNeeded() {
    if (
      !this.isFromFrequentTransaction() &&
      this.destCardProfileData() &&
      (this.c2cStateService.shouldRegisterDestinationCard() || this.c2cStateService.isSavedAsFrequentTransaction())
    ) {
      return this.c2cMainService.registerDestinationCard(this.destCardProfileData()).pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(() => of(null)),
      );
    }
    return of(null);
  }

  handleFrequentToggle(checked: boolean) {
    this.saveAsFrequentTransaction.set(checked);
  }

  goBack(step?: C2cStepsType): void {
    if (this.isFromFrequentTransaction()) {
      this.c2cStateService.selectedSourceCard.set(null);
      this.c2cStateService.selectedDestCard.set(null);
      this.c2cStateService.isFromFrequentTransaction.set(false);
      this.c2cStateService.isPaymentConfigLoaded.set(false);
    }
    if (step) {
      this.c2cMainService.goToStep(step);
    } else {
      this.c2cMainService.goToPrevStep();
    }
  }
}
