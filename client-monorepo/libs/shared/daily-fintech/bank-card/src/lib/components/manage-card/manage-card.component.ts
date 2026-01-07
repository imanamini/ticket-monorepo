import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subscription, switchMap, throwError } from 'rxjs';
import { JSEncrypt } from 'jsencrypt';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { BankCard } from '../../data-access/models/card-api.interface';
import { CardPreviewConfigInterface } from '../../data-access/models/card-preview-config.interface';
import { Bank } from '../../data-access/models/bank.interface';
import { CardProfilePayload } from '../../data-access/models/card-profile.interface';
import { PreviewComponent } from '../preview/preview.component';
import { RegisterCardDataInterface } from '../../data-access/models/register-card-data.interface';
import { BankCardApiService } from '../../data-access/services/bank-card-api.service';
import { BankCardService } from '../../data-access/services/bank-card.service';
import { CardZonesEnum } from '../../data-access/models/card-zones.enum';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'daily-bank-card-manage',
  standalone: true,
  imports: [CommonModule, PreviewComponent, UiFormFieldBuilderModule, ReactiveFormsModule, NgxSkeletonLoadingComponent, NgxButtonComponent],
  templateUrl: './manage-card.component.html',
  styleUrl: './manage-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageCardComponent implements OnInit, AfterViewInit, OnDestroy {
  bottomNavigationService = inject(NgxBottomNavigationService);
  mode = signal<string>('source');
  viewMode = signal<string>('add');
  redirectTo = signal<string>('');
  cardId = signal<string>('');
  isLoading = signal<boolean>(true);
  isSubmitting = signal<boolean>(false);
  currentCard = signal<BankCard>({} as BankCard);
  currentBank = signal<Bank | null>(null);
  form = new FormGroup({
    cardNumber: new FormControl('', [Validators.required, NgxFormValidator.cardNumberValidator()]),
    cardExpMonth: new FormControl('', [Validators.required, Validators.min(1), Validators.max(12)]),
    cardExpYear: new FormControl('', [Validators.required, Validators.min(3), Validators.max(99)]),
    cardTitle: new FormControl('', []),
  });
  banks: Array<Bank> = [];
  cardData = signal<CardPreviewConfigInterface>({
    isSkeleton: true,
    isExpanded: true,
    isLoading: true,
    width: '330px',
  });

  monthChangeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private bankCardApiService: BankCardApiService,
    private bankCardService: BankCardService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.bottomNavigationService.hide();
    this.mode.set(this.route.snapshot.paramMap.get('mode') ?? 'source');
    this.redirectTo.set(this.route.snapshot.queryParamMap.get('redirectTo') ?? '');
    this.viewMode.set(this.route.snapshot.paramMap.get('viewMode') ?? 'add');
    this.cardId.set(this.route.snapshot.paramMap.get('cardId') ?? 'source');
    this.getBanks();
    this.initPage();
  }

  ngAfterViewInit(): void {
    this.subscribeOnMonthChange();
  }

  initForm(): void {
    if (this.currentCard().cardIndex && this.viewMode() === 'edit') {
      this.cardData.set({
        ...this.cardData(),
        ...this.bankCardService.mapApiCardsToClientCards([this.currentCard()], this.mode() === 'destination')[0](),
        isSkeleton: false,
      });
      const expDate = this.cardData().expDate?.split('/') ?? ['', ''];
      this.form.controls.cardNumber.disable();
      this.form.controls.cardNumber.setValue(this.cardData().cardNumber ?? '');
      this.form.controls.cardTitle.setValue(this.cardData().bankName ?? '');
      this.form.controls.cardExpYear.setValue(expDate[0].slice(2));
      this.form.controls.cardExpMonth.setValue(expDate[1]);
      this.currentBank.set(this.bankCardService.findBankByCardPrefix(this.banks, this.cardData().cardNumber ?? ''));
    }
    if (this.mode() !== 'source') {
      this.form.controls.cardExpMonth.disable();
      this.form.controls.cardExpYear.disable();
    }
    this.form.valueChanges.subscribe((newValues) => {
      if (this.viewMode() !== 'edit') {
        this.currentBank.set(this.bankCardService.findBankByCardPrefix(this.banks, newValues.cardNumber ?? ''));
      }
      this.cardData.set({
        ...this.cardData(),
        isSkeleton: !this.currentBank(),
        cardNumber: this.viewMode() === 'edit' ? this.cardData().cardNumber : (newValues.cardNumber ?? ''),
        expDate: newValues.cardExpYear && newValues.cardExpMonth ? this.fixDates(newValues.cardExpYear, newValues.cardExpMonth, '') : '',
        bankName: newValues.cardTitle ? newValues.cardTitle : this.currentBank() ? this.currentBank()?.name : '',
        baseColor: this.currentBank() && this.currentBank()?.colorRange.length ? `#${this.currentBank()?.colorRange[0]}` : '',
        bankLogoId: this.currentBank() ? this.currentBank()?.cardBankLogoImageId : '',
      });
    });
    this.isLoading.set(false);
    this.cardData.set({
      ...this.cardData(),
      isLoading: false,
    });
  }

  private getBanks(): void {
    this.bankCardApiService.getAllBanks().subscribe({
      next: (response) => {
        this.banks = response.banks;
      },
      error: () => {
        this.messageService.showErrorMessage('در دریافت اطلاعات مشکلی بوجود آمده است، لطفا صفحه را مجددا بارگزاری نمایید');
      },
    });
  }

  subscribeOnMonthChange(): void {
    const monthFormControl = this.form.controls['cardExpMonth'];
    this.monthChangeSubscription = monthFormControl.valueChanges.subscribe((res: string | undefined | null) => {
      if (res && res.length === 2 && monthFormControl.valid) {
        const input = document.querySelector('#card-exp-year .dg-input-wrapper input') as HTMLElement;
        if (input) {
          input.focus();
        }
      }
    });
  }

  submitForm(): void {
    if (this.form.valid && this.currentBank() && !this.isSubmitting()) {
      const values = this.form.value;
      this.isSubmitting.set(true);
      if (this.viewMode() === 'edit') {
        const sendData: { [key: string]: any } = {
          alias: values.cardTitle,
          pinned: this.cardData().isPinned,
        };
        if (this.mode() === 'source' && values.cardExpMonth && values.cardExpYear) {
          sendData['expireDate'] = this.fixDates(values.cardExpYear ?? '', values.cardExpMonth ?? '');
        }
        this.bankCardApiService.updateCardById(this.cardId(), sendData).subscribe({
          next: () => {
            this.messageService.showSuccessMessage('اطلاعات کارت به روز شد');
            this.goToSavedCardPage();
            this.isSubmitting.set(false);
          },
          error: () => {
            this.messageService.showSuccessMessage('در به روز رسانی اطلاعات کارت خطایی بوجود آمده است، لطفا مجدد تلاش کنید');
          },
        });
      } else {
        this.bankCardApiService
          .getCardProfileCert(this.currentBank()?.profileCert ?? '')
          .pipe(
            switchMap((profileCert) => {
              const encrypt = new JSEncrypt();
              encrypt.setPublicKey(profileCert);
              const encryptedPan = encrypt.encrypt(values.cardNumber ?? '');
              const params: CardProfilePayload = {
                pan: {
                  value: encryptedPan ? encryptedPan : '',
                  type: 1,
                },
                certFile: this.currentBank()?.profileCert ?? '',
              };
              if (this.mode() === 'source') {
                params['pan']['expireDate'] = this.fixDates(values.cardExpYear ?? '', values.cardExpMonth ?? '');
              }
              return this.bankCardApiService.getCardProfile(params).pipe(
                switchMap((cardProfile) => {
                  this.cardData.set({
                    ...this.cardData(),
                    ownerName: cardProfile.cardHolder,
                  });
                  return this.bankCardApiService.getC2cConfig().pipe(
                    switchMap((response) => {
                      return this.bankCardApiService.getVaultCert(response.vaultCert).pipe(
                        switchMap((cert) => {
                          const encrypt = new JSEncrypt();
                          encrypt.setPublicKey(cert);
                          const encryptedPan = encrypt.encrypt(values.cardNumber ?? '');
                          const prefix = this.bankCardService.getCardPanPrefix(values.cardNumber ?? '');
                          const postfix = this.bankCardService.getCardPanPostfix(values.cardNumber ?? '');
                          const sendData: RegisterCardDataInterface = {
                            prefix: prefix,
                            postfix: postfix,
                            cardOwner: cardProfile.cardHolder,
                            encryptedPan: encryptedPan ? encryptedPan : '',
                            targetSide: this.mode() === 'destination',
                          };
                          if (this.mode() === 'source') {
                            sendData['expireDate'] = this.fixDates(values.cardExpYear ?? '', values.cardExpMonth ?? '');
                          }
                          if (values.cardTitle) {
                            sendData['alias'] = values.cardTitle;
                          }
                          return this.bankCardApiService.registerNewCard(sendData, CardZonesEnum.internal);
                        }),
                      );
                    }),
                  );
                }),
              );
            }),
          )
          .subscribe({
            next: () => {
              this.messageService.showSuccessMessage('کارت  با موفقیت افزوده شد');
              this.isSubmitting.set(false);
              this.goToSavedCardPage();
            },
            error: (error) => {
              this.handleError(error);
            },
          });
      }
    }
  }

  fixDates(year: string, month: string, yearPrefix = '14'): string {
    const fullYear = parseInt(year) >= 10 ? year : `0${parseInt(year)}`;
    const fullMonth = parseInt(month) >= 10 ? month : `0${parseInt(month)}`;
    return `${yearPrefix}${fullYear}/${fullMonth}`;
  }

  initPage(): void {
    this.cardData.set({
      ...this.cardData(),
      isDestination: this.mode() === 'destination',
    });
    if (this.viewMode() === 'edit' && this.cardId()) {
      if (this.mode() === 'source') {
        this.bankCardApiService.getUserCardById(this.cardId()).subscribe({
          next: (card) => {
            if (card) {
              this.currentCard.set(card);
            }
            this.initForm();
          },
        });
      } else {
        this.bankCardApiService.getTargetCardById(this.cardId()).subscribe({
          next: (card) => {
            if (card) {
              this.currentCard.set(card);
            }
            this.initForm();
          },
        });
      }
    } else {
      this.initForm();
    }
  }

  handleError(error: any): Observable<any> {
    if (error?.error?.result?.message) {
      this.messageService.showErrorOfErrorResponse(error);
      this.isSubmitting.set(false);
      return throwError(error?.error?.result?.message);
    } else {
      this.messageService.showErrorMessage('در  فرایند ثبت کارت خطایی بوجود آمده است، لطفا مجدد تلاش کنید');
      this.isSubmitting.set(false);
      return throwError('در  فرایند ثبت کارت خطایی بوجود آمده است، لطفا مجدد تلاش کنید');
    }
  }

  goToSavedCardPage() {
    if (this.redirectTo()) {
      this.router.navigate([this.redirectTo()]);
    } else {
      this.router.navigate(['/profile', 'saved-cards'], {
        queryParams: {
          tab: this.mode(),
        },
      });
    }
  }

  ngOnDestroy(): void {
    if (this.monthChangeSubscription) {
      this.monthChangeSubscription.unsubscribe();
    }
  }
}
