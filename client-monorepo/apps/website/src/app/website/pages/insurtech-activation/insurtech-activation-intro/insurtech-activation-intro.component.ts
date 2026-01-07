import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  EventEmitter, Inject,
  Input,
  OnInit,
  Output, PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import {
  InsuranceActivation,
  OwnershipOther,
} from '../../../../api/clients/models/templates/insurtech-activation/insurtech-activation-template-data';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { convertNonEnglishDigits } from '@digipay/strings';
import { ValidateCellNum } from '../../../../core/validators/cell-num.validator';
import { SwiperOptions } from 'swiper/types';
import { ActivatedRoute } from '@angular/router';
import { SwiperContainer } from 'swiper/swiper-element';
import { InsurtechOwnershipOtherComponent } from './insurtech-ownership-other/insurtech-ownership-other.component';
import { UiCardNoticeComponent } from '../../../../ui/ui-components/ui-card-notice/ui-card-notice.component';
import { UiButtonComponent } from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {isPlatformBrowser, NgClass, NgIf} from '@angular/common';
import { SwiperDirective } from '../../../../ui/ui-directive/swiper.directive';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';

@Component({
  selector: 'app-insurtech-activation-intro',
  templateUrl: './insurtech-activation-intro.component.html',
  styleUrls: ['./insurtech-activation-intro.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    UiButtonComponent,
    NgClass,
    ReactiveFormsModule,
    UiCardNoticeComponent,
    InsurtechOwnershipOtherComponent,
    SwiperDirective,
    UiFormFieldBuilderModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class InsurtechActivationIntroComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  @Input()
  ownershipOther: OwnershipOther;

  @Input()
  insuranceActivation: InsuranceActivation[];

  @Output()
  serviceActiveIndex = new EventEmitter<number>();

  form: UntypedFormGroup;

  textFieldHasError = false;

  textFieldFocused = false;

  cellNumberValidationRules = [Validators.required, Validators.pattern(/^0/), ValidateCellNum];

  config: SwiperOptions = {
    loop: false,
    slidesPerView: 2,
    watchSlidesProgress: true,
  };

  activeIndex = 0;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.clearCellNumber();

    this.form.valueChanges.subscribe((data) => {
      if (Number.isInteger(data.cellNumber)) {
        let val = String(data.cellNumber);
        if (!val.match(/^0/)) {
          val = '0' + val;
        }
        this.form.controls['cellNumber'].setValue(val, {
          emitEvent: false,
        });
        this.checkTextFieldErrors();
      } else {
        this.form.controls['cellNumber'].setValue(convertNonEnglishDigits(data.cellNumber), {
          emitEvent: false,
        });
        this.checkTextFieldErrors();
      }
    });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      cellNumber: ['', this.cellNumberValidationRules],
    });
    this.route.queryParams.subscribe((params) => {
      if (params.state === 'activation') {
        this.changeTab(0);
      } else if (params.state === 'transfer') {
        this.changeTab(1);
      }
    });
  }

  checkTextFieldErrors() {
    const ctrl = this.form.controls['cellNumber'];
    let val = false;
    if (ctrl.hasError('pattern') && ctrl.touched) {
      val = true;
    }
    if (ctrl.hasError('cellNumber') && ctrl.touched && !this.textFieldFocused) {
      val = true;
    }
    this.textFieldHasError = val;
  }

  clearCellNumber() {
    this.form = this.formBuilder.group({
      cellNumber: ['', this.cellNumberValidationRules],
    });
  }

  onSubmit() {
    const obj = this.form.value;
    obj.cellNumber = convertNonEnglishDigits(obj.cellNumber);
    if(isPlatformBrowser(this.platformId)){
      window.location.href = `https://insurance-cp.mydigipay.com/auth/login?cellNumber='${obj.cellNumber}`
    }

  }

  changeTab(index: number) {
    this.activeIndex = index;
    this.changeService(index === 0 ? 2 : index === 1 ? 3 : 0);
    this.changeDetector.detectChanges();
  }

  changeService(index: number) {
    this.serviceActiveIndex.emit(index);
  }

  scrollToAnchor(element: string) {
    const El = document.getElementById(element);
    if (El) {
      El.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
    if (element === 'insurtech-services-processes') this.changeService(2);
  }
}
