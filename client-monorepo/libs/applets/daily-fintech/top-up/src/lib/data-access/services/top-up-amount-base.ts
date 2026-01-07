import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { convertNonEnglishDigits, currencyFormat } from '@digipay/strings';
import { ChargePackage, TopUpInfo } from '../models/topup-Info.model';
import { TopUpAmount } from '../validators/top-up-amount.validator';

/*
|--------------------------------------------------------------------------
| TopUpAmount Base class
|--------------------------------------------------------------------------
| This class is extended by two different component as they have a
| completely different views.
| Desktop users enter/pick sim-cards amount in a separate page where as
| mobile users do this using a bottom sheet.
|
*/
export class TopUpAmountBase {
  public data!: {
    cellNumber: string;
    operatorCode: string;
    operatorId: string;
    operatorName: string;
    packages: Array<TopUpInfo>;
    defaultAmount: number;
    amountFactor: number;
    minAmount: number;
    maxAmount: number;
  };

  /**
   * Form Group
   */
  public form: UntypedFormGroup;

  /**
   * Mode of entering amount
   */
  public mode: 'SELECT_PACKAGE' | 'VARIANT_VALUE' = 'SELECT_PACKAGE';

  /**
   * Small amount of delay to show text field (material UI's floating label issue)
   */
  public showTextField = false;

  /**
   * Array of available packages
   */
  public packages: Array<TopUpInfo> = [];

  /**
   * Fascinating Checkbox
   */
  public isFascinating = false;
  /**
   * Keeps the selected amount
   */
  selectedAmount: ChargePackage | null | undefined;

  /**
   * A text to show when sim-cards amount is invalid
   */
  invalidAmountError = '';

  constructor(protected formBuilder: UntypedFormBuilder) {
    this.form = this.formBuilder.group({
      formattedAmount: [''],
      amount: ['', [Validators.pattern(/^\d{3,10}$/i)]],
    });

    this.form.valueChanges.subscribe((data) => {
      this.makeInvalidAmountErrorMessage();
      let a = data.formattedAmount;
      if (a?.length > 0) {
        this.selectedAmount = null;
        a = convertNonEnglishDigits(a);
        a = a.replace(/[^\d]/g, '');
        this.form.controls['amount'].setValue(a, {
          emitEvent: false,
        });
        this.mode = 'VARIANT_VALUE';
      } else {
        this.mode = 'SELECT_PACKAGE';
      }
    });
  }

  clearAmountInput() {
    this.form.controls['formattedAmount'].setValue('', {
      emitEvent: false,
    });
    this.form.controls['amount'].setValue('', {
      emitEvent: false,
    });

    this.mode = 'SELECT_PACKAGE';
    this.selectDefaultPackage();
  }

  protected getSelectedAmount() {
    let selected = null;
    if (this.mode === 'VARIANT_VALUE') {
      const a = parseInt(this.form.controls['amount'].value);
      if (!a) {
        return null;
      }
      selected = {
        amount: a,
        recommended: false,
      } as ChargePackage;
    } else {
      if (!this.selectedAmount) {
        return null;
      }
      selected = this.selectedAmount;
    }

    return selected;
  }

  hasAnyFascinatingPackage(): boolean {
    return !!this.getFascinatingPackages();
  }

  getNormalPackageTitle() {
    return this.getNormalPackages()?.description;
  }

  getFascinatingPackageTitle() {
    return this.getFascinatingPackages()?.description;
  }

  getFascinatingDescription() {
    return this.getFascinatingPackages()?.subDescription;
  }

  protected getNormalPackages(): TopUpInfo | null {
    const f = this.packages.filter((p) => parseInt(p.chargeType) === 2);
    if (f.length > 0) {
      return f[0];
    }
    return null;
  }

  protected getFascinatingPackages(): TopUpInfo | null {
    const f = this.packages.filter((p) => parseInt(p.chargeType) === 1);
    if (f.length > 0) {
      return f[0];
    }
    return null;
  }

  onSelectAmount(amount: ChargePackage) {
    this.form.setValue({
      amount: '',
      formattedAmount: '',
    });
    this.form.markAsUntouched();
    this.selectedAmount = amount;
  }

  protected selectDefaultPackage() {
    const normalPackages = this.getNormalPackages();
    if (this.data.defaultAmount) {
      const s = normalPackages?.chargePackages.filter((p) => p.amount === this.data.defaultAmount);
      if (s && s.length > 0) {
        this.selectedAmount = s[0];
      } else {
        this.selectedAmount = normalPackages?.chargePackages[0];
      }
    } else {
      this.selectedAmount = normalPackages?.chargePackages[0];
    }
  }

  switchChange() {
    const packages = this.getFascinatingPackages();
    const selectedPackageList = packages?.chargePackages.filter((p) => p.amount === this.selectedAmount?.amount);
    if (this.isFascinating && this.selectedAmount) {
      if (selectedPackageList?.length === 0) {
        // Select Default package when package doesn't match
        this.selectedAmount = packages?.chargePackages[0];
      } else {
        //  Select match package
        this.selectedAmount = selectedPackageList?.[0];
      }
    }
    if (this.isFascinating) {
      this.form.setValue({
        formattedAmount: '',
        amount: '',
      });
      this.form.controls['amount'].markAsUntouched();
      this.form.controls['formattedAmount'].markAsUntouched();
    }
  }

  getPackageGroup(): TopUpInfo {
    let packageGroup = null;
    if (this.isFascinating) {
      packageGroup = this.getFascinatingPackages();
    } else {
      packageGroup = this.getNormalPackages();
    }
    return packageGroup as TopUpInfo;
  }

  setAmountValidationRules() {
    this.form.controls['formattedAmount'].setValidators([TopUpAmount(this.data.minAmount, this.data.maxAmount, this.data.amountFactor)]);
  }

  makeInvalidAmountErrorMessage() {
    const multipleError = this.form.controls['formattedAmount'].getError('invalidMultiple');
    const amountError = this.form.controls['formattedAmount'].getError('invalidAmount');
    if (multipleError && amountError) {
      this.invalidAmountError = 'مبلغ وارد شده باید ' + ' مضرب عدد ' + currencyFormat(this.data.amountFactor) + ' باشد';
    }
    if (multipleError) {
      this.invalidAmountError = 'مبلغ وارد شده باید ' + ' مضرب عدد ' + currencyFormat(this.data.amountFactor) + ' باشد';
    }
    if (amountError) {
      this.invalidAmountError =
        'مبلغ وارد شده باید بین ' + currencyFormat(this.data.minAmount) + ' و ' + currencyFormat(this.data.maxAmount) + ' ريال ' + 'باشد';
    }
  }
}
