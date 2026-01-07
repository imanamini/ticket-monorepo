import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MerchantsApiService } from '../../../../../../api/clients/credit/merchants-api.service';
import { UserService } from '../../../../../../core/services/user.service';
import { StorageInterface } from '@digipay/ng-storage';
import { StorageSchema } from '../../../../../../core/models/storage-schema';
import { ActivatedRoute } from '@angular/router';
import { DialogBottomSheetService } from '../../../../../../core/services/dialog-bottom-sheet.service';
import { UiSpinnerComponent } from '../../../../../../ui/ui-components/ui-loading/ui-spinner/ui-spinner.component';
import { WorkingCapitalCalculatorComponent } from '../working-capital-calculator/working-capital-calculator.component';
import { WorkingCapitalNotExistComponent } from '../working-capital-not-exist/working-capital-not-exist.component';
import { WorkingCapitalFormComponent } from '../working-capital-form/working-capital-form.component';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { UiSectionComponent } from '../../../../../../ui/ui-components/ui-section/ui-section/ui-section.component';
import { UiDialogLoginComponent } from '../../../../../../ui/ui-components/ui-dialogs/ui-dialog-login/ui-dialog-login.component';

@Component({
  selector: 'app-working-capital-wrapper',
  templateUrl: './working-capital-wrapper.component.html',
  styleUrls: ['./working-capital-wrapper.component.scss'],
  standalone: true,
  imports: [
    UiSectionComponent,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    WorkingCapitalFormComponent,
    WorkingCapitalNotExistComponent,
    WorkingCapitalCalculatorComponent,
    UiSpinnerComponent,
  ],
})
export class WorkingCapitalWrapperComponent implements OnInit {
  loading = false;
  cellNumber = '';
  maxLoan: number;
  error: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };

  state: 'FORM' | 'NOT_EXIST' | 'CALCULATOR' = 'FORM';

  @Output() errorType = new EventEmitter();

  dataMapper = {
    FORM: {
      title: 'اطلاعات مربوط به فروشنده را وارد کنید.',
    },
    NOT_EXIST: {
      title: 'درحال حاضر،  وام به شما تعلق نگرفته است.',
    },
    CALCULATOR: {
      title: 'اطلاعات مبلغ وام مورد نیاز خود را انتخاب کنید.',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private merchantsApiService: MerchantsApiService,
    private userService: UserService,
    private dialog: DialogBottomSheetService,
    @Inject('StorageInterface') public storage: StorageInterface<StorageSchema>,
  ) {}

  ngOnInit(): void {
    const auth = this.storage.get('auth.access', '');
    this.route.queryParams.subscribe((params) => {
      if (params.nationalCode && params.birthDate && !auth) {
        this.dialog.open(UiDialogLoginComponent, {});
      } else if (params.nationalCode && params.birthDate && auth) {
        this.loading = true;
        this.userService.currentUser().then((user) => {
          this.cellNumber = user.cellNumber;
          this.merchantsApiService.checkMerchantWorkingCapital(params.nationalCode).subscribe(
            (res) => {
              this.loading = false;
              this.maxLoan = res.merchant.maximum_loan;

              this.state = 'CALCULATOR';
            },
            (error) => {
              this.loading = false;
              this.error = {
                title: '',
                subtitle: 'برای دریافت وام، درخواست امکان‌سنجی بدهید.',
                description: 'در قسمت امکان‌سنجی وام،درخواست شما بررسی خواهد شد. برای اطلاعات بیشتر با شماره زیر تماس بگیرید.',
                ctaText: 'درخواست وام',
                ctaLink: `scroll`,
              };
              this.state = 'NOT_EXIST';
              this.errorType.emit('NOT_EXIST');
            },
          );
        });
      } else if (auth && !params.nationalCode && !params.birthDate) {
        this.loading = true;
        this.userService.currentUser().then((user) => {
          this.cellNumber = user.cellNumber;
          this.merchantsApiService.checkMerchantWorkingCapital(this.cellNumber).subscribe(
            (res) => {
              this.loading = false;
              this.state = 'FORM';
            },
            (error) => {
              this.loading = false;
              this.error = {
                title: '',
                subtitle: 'کدملی  وارد شده به فروشنده ای  در دیجی ‌کالا ‌ تعلق ندارد.',
                description: 'لطفا کدملی  را وارد کنید که در دیجی‌کالا ثبت شده است.',
                ctaText: 'خروج و ویرایش شماره همراه و و کدملی',
                ctaLink: `users/logout`,
              };
            },
          );
        });
      }
    });
  }

  updateError(error: { title: string; subtitle: string; description: string; ctaText: string; ctaLink: string }) {
    this.state = 'NOT_EXIST';
    this.dataMapper['NOT_EXIST'].title = error.title;
    this.error = error;
  }
}
