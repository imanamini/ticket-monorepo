import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { ContactForm } from '../../../../api/clients/models/templates/contact-us/contact-form';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'jalali-moment';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { UserService } from '../../../../core/services/user.service';
import { NobitexCreditService } from '../../../../api/clients/nobitex/nobitex-credit.service';
import { BehaviorSubject, delay, of, Subscription } from 'rxjs';
import { MessageService } from '@client-monorepo/common/utilities';
import { IdentityInfo } from '../../../../ui/models/nobitex/identity-info.model';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AsyncPipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { UiIconDirective } from '../../../../ui/ui-directive/ui-icon.directive';

export interface validateUserInShahkar {
  nationalId: string;
  cellNumber: string;
  birthdate: number;
}

@Component({
  selector: 'app-custom-contact-form',
  templateUrl: './custom-contact-form.component.html',
  styleUrls: ['./custom-contact-form.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    NgSwitch,
    NgSwitchCase,
    NgClass,
    UiFormFieldBuilderModule,
    NgIf,
    UiButtonComponent,
    AsyncPipe,
    UiIconDirective,
  ],
})
export class CustomContactFormComponent implements OnInit, OnDestroy {
  shahkarUserValidation$!: Subscription;

  form: UntypedFormGroup;
  errors: string[] = [];
  disableCellPhone = false;
  disableNationalId = false;
  disableBirthdate = false;
  userIdentity: IdentityInfo;

  showError: 'show' | 'hidden' | 'auto' = 'hidden';
  showDatePicker = true;
  identityError = '';
  identityErrorBD: BehaviorSubject<string> = new BehaviorSubject<string>('');
  identityErrorBD$ = this.identityErrorBD.asObservable();

  minBirthDate: number = moment().subtract('70', 'year').valueOf();
  maxBirthDate: number = moment().subtract('18', 'year').valueOf();

  state: 'FORM' | 'NOT_EXIST' | 'CALCULATOR' = 'CALCULATOR';

  @Input()
  contactFormDefinition!: ContactForm;

  @Input()
  submitBtn = 'تایید';

  @Input() buttonLink: string;

  @Input()
  checkButton = 'استعلام کد ملی';

  @Output()
  closeDialogButton: EventEmitter<any> = new EventEmitter();

  @Output()
  validateUserInShahkar: EventEmitter<validateUserInShahkar> = new EventEmitter();

  @Output() onNext = new EventEmitter();

  error: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };

  focusState: {
    [key: string]: boolean;
  } = {};

  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(PLATFORM_ID) public platformId: string,
    private messageService: MessageService,
    private userService: UserService,
    protected nobitexCreditService: NobitexCreditService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.form = this.formBuilder.group({
      isAccepted: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    this.makeForm();
    this.form.get('birth-date').statusChanges.subscribe((result) => {});
    this.shahkarUserValidation$ = this.nobitexCreditService.isUserIdentified().subscribe((identity) => {
      if (identity) {
        this.userIdentity = identity;
        if (identity?.shahkarStatus) {
          this.identityError = '';
        } else {
          this.identityError = 'کدملی مالک خط را وارد کنید';
          this.nobitexCreditService.isLoading.next(false);
          this.form.get('national-id')?.setErrors({
            identityErrorMessage: true,
          });
          return;
        }

        if (!identity?.sabteAhval?.birthDateStatus) {
          this.showDatePicker = false;
          of('')
            .pipe(delay(10))
            .subscribe({
              next: () => {
                this.showDatePicker = true;
                this.identityErrorBD.next('تاریخ تولد مالک خط را وارد کنید');
                this.changeDetectorRef.markForCheck();
                this.showError = 'show';
                this.nobitexCreditService.isLoading.next(false);
              },
            });
        }

        if (identity?.sabteAhval?.deathStatus) {
          of('')
            .pipe(delay(10))
            .subscribe({
              next: () => {
                this.showDatePicker = true;
                this.identityErrorBD.next('صاحب این کد ملی فوت شده است.');
                this.changeDetectorRef.markForCheck();
                this.showError = 'show';
                this.nobitexCreditService.isLoading.next(false);
              },
            });
        }
      }
    });
  }

  ngOnDestroy() {
    this.shahkarUserValidation$?.unsubscribe();
  }

  private makeForm() {
    this.contactFormDefinition.rows.forEach((row) => {
      row.forEach((field) => {
        const rules = [];
        if (field.mandatory) {
          rules.push(Validators.required);
        }
        if (field.type === 'TAB') {
          const value = field.options[1].value;
          this.form.addControl(field.id, new UntypedFormControl(value, rules));
        } else this.form.addControl(field.id, new UntypedFormControl('', rules));
        if (field.type === 'NATIONAL_ID') {
          rules.push(NgxFormValidator.nationalCodeValidator());
        }
        if (field.type === 'CELL_NUMBER') {
          rules.push(NgxFormValidator.cellNumberValidator());
        }
      });
    });
    if (this.userService.isLoggedIn.value) {
      this.userService.currentUser().then((user) => {
        this.form.get('mobile')?.setValue(user.cellNumber);
        this.disableCellPhone = true;
      });
    }
  }

  next() {
    if (!this.userService.isLoggedIn.value) {
      this.messageService.showErrorMessage('برای ادامه فرایند باید وارد شوید');
      this.nobitexCreditService.showSpinner.next(false);
      return;
    }
    if (this.form.invalid) {
      if (this.form.get('national-id').invalid) {
        this.messageService.showErrorMessage('کد ملی را وارد نمایید');
        return;
      }
      if (this.form.get('birth-date').invalid) {
        this.messageService.showErrorMessage('تاریخ تولد را وارد نمایید');
        return;
      }
    } else {
      const userInfo: validateUserInShahkar = {
        cellNumber: this.form.get('mobile').value,
        nationalId: this.form.get('national-id').value,
        birthdate: this.form.get('birth-date').value,
      };
      this.validateUserInShahkar.emit(userInfo);
    }
  }
}
