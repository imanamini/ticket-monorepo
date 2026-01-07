import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { IProcessData } from '../../models/wallet-process.interface';
import { RouteStateService } from '@client-monorepo/common/utilities';
import { isValidIBANNumber } from '../../../../components/utils/strings';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { BaseComponent } from '../../../../components/core/components/base/base.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { BankAccountService } from '../../../../components/core/services/v1/bank-account.service';
import { SELECT_BANK_ACCOUNT_ROUTE, WALLET_CASH_OUT_ROUTE } from '../../../../data-access/constants/app-routes';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'wealth-applet-wallet-iban',
  standalone: true,
  imports: [NgxAppBarComponent, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent, SpinnerComponent],
  styleUrl: './wallet-iban.component.scss',
  templateUrl: './wallet-iban.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletIbanComponent extends BaseComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private routeState = inject(RouteStateService);
  private activatedRoute = inject(ActivatedRoute);
  private bankAccountService = inject(BankAccountService);
  private navigationService = inject(WealthNavigationService);

  form!: FormGroup;
  isLoading = signal<boolean>(false);
  checkSejamLoading = signal<boolean>(false);
  walletId = signal<string | undefined>(undefined);
  state = signal<IProcessData | undefined>(undefined);
  parentErrors = signal<{
    [key: string]: string;
  }>({});

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.state.set(this.routeState.getAll());
    this.walletId.set(this.activatedRoute.snapshot.paramMap.get('id'));
    if (!this.state()?.nationalId) {
      this.navigationService.navigate([WALLET_CASH_OUT_ROUTE, this.walletId()]);
    }
    this.createForm({ iban: '' });
  }

  onBackHandler() {
    this.navigationService.navigate([SELECT_BANK_ACCOUNT_ROUTE, this.walletId()], {
      state: {
        ...this.state(),
      },
    });
  }

  serverErrorValidator(controlName: string): ValidatorFn {
    return (): ValidationErrors | null => {
      return this.parentErrors()[controlName] ? { serverError: true } : null;
    };
  }

  submitIban() {
    this.checkSejamLoading.set(true);

    this.bankAccountService
      .addNewBankAcccount(this.form?.controls['iban'].value)
      .pipe(finalize(() => this.checkSejamLoading.set(false)))
      .subscribe((res) => {
        if (res.success) {
          this.navigationService.navigate([SELECT_BANK_ACCOUNT_ROUTE, this.walletId()], {
            state: {
              ...this.state(),
            },
          });
        } else {
          this.parentErrors.set({
            iban: res.error.title,
          });
        }
      });
  }

  private ibanChecksumValidator(control: FormControl): { [p: string]: boolean } | null {
    if (isValidIBANNumber(this.cleanIban(control.value))) {
      return null;
    }
    return { invalidIban: true };
  }

  private cleanIban(value: string) {
    if (!value) {
      return value;
    }
    return value.replace('-', '').replace(/\s/gi, '');
  }

  private createForm(preFillData: { iban: string }): void {
    this.form = this.formBuilder.group({
      iban: [
        preFillData.iban,
        [Validators.required, Validators.pattern(/IR\d{24}$/i), this.serverErrorValidator('iban'), this.ibanChecksumValidator.bind(this)],
      ],
    });
    if (preFillData.iban) {
      this.form.controls['iban'].markAsTouched();
    }
  }
}
