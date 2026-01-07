import { Component, OnInit, signal } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ScrollableView } from '../../../credit-ui/scrollable-view';
import { convertNonEnglishDigits } from '../../../../utils/strings';
import { PageDialogComponent } from '../../../credit-ui/page-dialog/page-dialog.component';
import { CreditApiService } from '../../../api/credit-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../core/services/message.service';
import moment from 'jalali-moment';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services/storage.service';
import { BnplErrorHandlingService } from '../services/bnpl-error-handling.service';
import { NgxFormValidator } from '@digipay/ngx-form-validator';
import { JournalTypeEnum } from '../../../api/models/bnpl/campaigns/campaign-wallet.request';

export type StateType = 'INFO_FORM' | 'ERROR';

@Component({
  selector: 'app-bnpl-activation',
  templateUrl: './bnpl-activation.component.html',
  styleUrls: ['./bnpl-activation.component.scss']
})
export class BnplActivationComponent extends ScrollableView implements OnInit {
  form: UntypedFormGroup;
  gettingContract: boolean;
  sendingData: boolean;
  gettingProfile: boolean;
  focusOnNationalCode: boolean;

  cellNumber = signal('');
  state = signal<StateType>('INFO_FORM');
  errorType = signal<number>(null);

  journalTypeEnum = JournalTypeEnum;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private creditApiService: CreditApiService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private bnplErrorHandlingService: BnplErrorHandlingService,
    private router: Router,
    private storageService: StorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.getUserProfile();
    this.createForm();
  }

  birthDateValidator(control: UntypedFormControl): { [s: string]: boolean } {
    const value = control.value;
    const age = moment().diff(moment(value), 'years', true);
    return age >= 18 ? null : {lessThan18Years: true};
  }

  openContract($event: MouseEvent) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }
    if (this.gettingContract) {
      return;
    }
    this.gettingContract = true;
    this.creditApiService.getBnplTac().subscribe(r => {
      this.gettingContract = false;
      this.dialog.open(PageDialogComponent, {
        panelClass: ['page-dialog-component'],
        data: {
          title: 'قوانین و مقررات',
          relativeUrl: r.tacTextUrl,
        }
      });
    }, e => {
      this.gettingContract = false;
      if (e && e.result) {
        this.messageService.showErrorMessage(e.result.message);
        return;
      }
      if (e && e.httpStatus === 401) {
        this.goToExpiredTokenPage();
      }
      this.messageService.showErrorMessage('بروز خطا در دریافت اطلاعات قوانین و مقررات');
    });
  }

  onSubmit() {
    this.changeState('INFO_FORM');
    if (this.form.invalid && this.sendingData) {
      return;
    }

    this.sendingData = true;
    this.creditApiService.acceptBnplTac().subscribe(() => {
      this.creditApiService.registerBnpl({
        nationalCode: convertNonEnglishDigits(this.form.value.nationalCode),
        birthDate: moment(this.form.value.birthDate).locale('fa').format('YYYY/MM/DD'),
        journalType: this.journalTypeEnum.POSE_LANDING
      }).subscribe(() => {
        const ticket = this.storageService.get('ticket');
        this.router.navigateByUrl(`bnpl-pay/confirm/${ticket}`).then();
        this.sendingData = false;
      }, error => {
        this.bnplErrorHandlingService.setCellNumber(error?.cellNumber ?? '');
        this.bnplErrorHandlingService.setNationalCode(error?.nationalCode ?? '');
        this.sendingData = false;
        if (error && error.httpStatus === 500) {
          this.messageService.showErrorMessage(error.result.message);
          return;
        }

        // /*dp scoring or credit scoring failed*/
        if (error && (error.result?.status === 5245 || error.result?.status === 5246)) {
          this.router.navigate(['/bnpl/scoring-failed']);
          return;
        }

        this.changeState('ERROR');
        if (error && (error.httpStatus === 401 || error.httpStatus === 429)) {
          this.errorType.set(error.httpStatus);
          return;
        }
        this.errorType.set(error.result?.status);
      });
    }, e => {
      if (e && e.httpStatus === 401) {
        this.changeState('ERROR');
        this.errorType.set(e.httpStatus);
      }
      if (e && e.result) {
        this.messageService.showErrorMessage(e.result.message);
      }
      this.sendingData = false;
    });
  }

  changeState(state: StateType) {
    this.state.set(state);
  }

  getUserProfile() {
    this.gettingProfile = true;
    this.creditApiService.getUserProfile().subscribe({
      next: response => {
        this.cellNumber.set(response.userDetail.cellNumber);
        this.bnplErrorHandlingService.setCellNumber(this.cellNumber());
        this.gettingProfile = false;
      },
      error: error => {
        this.gettingProfile = false;
        if (error && error.httpStatus === 401) {
          this.changeState('ERROR');
          this.errorType.set(error.httpStatus);
        }
      }
    });
  }

  goToExpiredTokenPage() {
    this.router.navigateByUrl('/error', {
      state: {
        errorText: 'خرید منقضی شده است'
      }
    });
  }

  backToMerchant() {
    this.router.navigate(['cancel']);
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      nationalCode: [null, [Validators.required, NgxFormValidator.nationalCodeValidator]],
      birthDate: [null, [Validators.required, this.birthDateValidator]],
      acceptContract: [false, [Validators.requiredTrue]],
    });
  }
}
