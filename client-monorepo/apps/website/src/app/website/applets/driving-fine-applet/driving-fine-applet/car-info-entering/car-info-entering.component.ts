import { Component, OnInit } from '@angular/core';
import { DialogBottomSheetService } from '../../../../../core/services/dialog-bottom-sheet.service';
import {
  AbstractControl,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UiVehicleService } from '../../services/ui-vehicle.service';
import { PlateColor, VehiclePlate } from '../../../../../api/digipay/models/driving-fine/vehicle-plate';
import { FineStateManagerService } from '../../services/fine-state-manager.service';
import { UserService } from '../../../../../core/services/user.service';
import { FineApiService } from '../../services/fine-api.service';
import { FineDataService } from '../../services/fine-data.service';
import { plateDetails } from './plateDetails';
import { StyledSwitchOption } from '../../../../../ui/models/switch-option.model';
import { UiDialogLoginComponent } from '../../../../../ui/ui-components/ui-dialogs/ui-dialog-login/ui-dialog-login.component';
import { TrafficFinesDto } from '../../../../../api/digipay/models/driving-fine/fine-config.response';
import { Router } from '@angular/router';
import { ServicePromotion } from '../../../../../api/clients/models/templates/car-fine/car-fine-template-data';
import { MessageService } from '@client-monorepo/common/utilities';
import { LastInquiryReportComponent } from './last-inquiry-report/last-inquiry-report.component';
import { PlatesListComponent } from './plates-list/plates-list.component';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { UiPlateInputComponent } from '../../../../../ui/ui-components/ui-plate-input/ui-plate-input/ui-plate-input.component';
import { UiAnimatedSwitchComponent } from '../../../../../ui/ui-components/ui-switch/ui-animated-switch/ui-animated-switch.component';
import { UiButtonComponent } from '../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import { NgFor, NgIf, NgOptimizedImage } from '@angular/common';
import { UiIconDirective } from '../../../../../ui/ui-directive/ui-icon.directive';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-car-info-entering',
  templateUrl: './car-info-entering.component.html',
  styleUrls: ['./car-info-entering.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    UiButtonComponent,
    UiIconDirective,
    UiAnimatedSwitchComponent,
    ReactiveFormsModule,
    UiPlateInputComponent,
    UiFormFieldBuilderModule,
    NgFor,
    NgOptimizedImage,
    PlatesListComponent,
    LastInquiryReportComponent,
    NgxIcon,
  ],
})
export class CarInfoEnteringComponent implements OnInit {
  carInfoState: 'ENTERING_NEW_PLATE' | 'PLATES_LIST' | 'PLATE_LAST_INQUIRY' = 'ENTERING_NEW_PLATE';

  vehicleTypes: Array<StyledSwitchOption> = [
    {
      label: 'خودرو',
      value: 0,
    },
    {
      label: 'موتور سیکلت',
      value: 1,
      isActive: false,
      hint: 'استعلام خلافی موتورسیکلت به زودی فعال میگردد.',
    },
  ];

  colors: {
    [code: string]: PlateColor;
  } = {};

  values = { part1: '', part2: '', part3: '', part4: '' };

  enabled = true;

  form: FormGroup;

  isFormValid = false;

  trafficFineDto: TrafficFinesDto;

  fineTrackingCode = '';

  servicePromotions: Array<ServicePromotion>;

  isPlateInputTouched = false;

  constructor(
    private dialog: DialogBottomSheetService,
    private formBuilder: UntypedFormBuilder,
    private uiVehicleService: UiVehicleService,
    private fineStateManager: FineStateManagerService,
    private userService: UserService,
    private fineApiService: FineApiService,
    private fineDataService: FineDataService,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      plateTitle: ['ماشین من', Validators.required],
      plateNo: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9), this.nonZeroPlateValidator()]],
    });

    this.form.statusChanges.subscribe((status) => {
      this.isFormValid = status === 'VALID';
    });

    this.uiVehicleService.generatePlateColors(plateDetails);

    this.uiVehicleService.plateColors.subscribe((colors) => {
      this.colors = colors;
      this.loadCarInfo();
    });

    this.fineDataService.fineInitialData.subscribe((initialData) => {
      this.servicePromotions = initialData?.promotions;
    });
  }

  nonZeroPlateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = +control.value;

      if (!value) {
        return null;
      }

      const isZeroValidity = false;

      const isP1Valid = Math.floor(+this.values.part1 / 10) > 0;
      const isP3Valid = Math.floor(+this.values.part3 / 100) > 0;
      const isP4Valid = Math.floor(+this.values.part4 / 10) > 0;

      const isValueValid = isP1Valid && isP3Valid && isP4Valid;

      return !isValueValid ? { isZero: isZeroValidity } : null;
    };
  }

  loadCarInfo() {
    const parsedCarInfo: { plateTitle: string; plateNo: string } = this.fineDataService.loadCarInfoFromSessionStorage();

    if (parsedCarInfo && parsedCarInfo.plateNo) {
      this.buildPlateValues(parsedCarInfo.plateNo);

      this.form.patchValue(parsedCarInfo);
    }
  }

  buildPlateValues(plateNo: string) {
    this.values = {
      part1: plateNo.slice(0, 2),
      part2: plateNo.slice(2, 4),
      part3: plateNo.slice(4, 7),
      part4: plateNo.slice(7),
    };
  }

  plateInputChange($event) {
    this.values = { ...$event };
    this.buildPlateNo();
  }

  nextStep() {
    if (!this.form.valid) {
      return;
    }

    this.fineDataService.saveVehicleOnSessionStorage(this.form.value.plateTitle, this.form.value.plateNo);

    this.fineStateManager.nextStep();

    if (this.userService.isLoggedIn.getValue() === true) {
      this.fineApiService
        .addNewPlate({
          plateNo: this.form.value.plateNo,
          title: this.form.value.plateTitle,
        })
        .subscribe(() => {
          this.messageService.showSuccessMessage('اطلاعات پلاک به لیست پلاک‌ها افزوده شد');
        });

      const carInfo = {
        title: this.form.value['plateTitle'],
        plateNo: this.form.value['plateNo'],
      };

      this.fineDataService.setCarInfo(carInfo);
    }
  }

  platesListClicked() {
    if (this.form.valid) {
      this.fineDataService.saveVehicleOnSessionStorage(this.form.value.plateTitle, this.form.value.plateNo);
    }

    if (!this.userService.isLoggedIn.getValue()) {
      this.dialog.open(UiDialogLoginComponent, {});
      return;
    }

    this.carInfoState = 'PLATES_LIST';
  }

  enterNewPlate() {
    this.fineDataService.setCarInfo({ title: '', plateNo: '' });

    this.buildPlateValues('');

    this.carInfoState = 'ENTERING_NEW_PLATE';

    this.fineDataService.clearVehicleDetailOnSessionStorage();
  }

  showInquiryLastReport(selectedPlate: VehiclePlate) {
    this.fineDataService.saveVehicleOnSessionStorage(selectedPlate.title, selectedPlate.plateNo);
    this.fineApiService.verifyInquiryAndGetDetail(selectedPlate.inquiryTrackingCode).subscribe((trafficFine) => {
      this.trafficFineDto = trafficFine.trafficFinesDto;
      this.carInfoState = 'PLATE_LAST_INQUIRY';
      this.fineTrackingCode = selectedPlate.inquiryTrackingCode;
    });
  }

  payVehicleFine() {
    this.router.navigate([], {
      queryParams: {
        fineTrackingCode: this.fineTrackingCode,
        step: 'inquiry',
      },
      queryParamsHandling: 'merge',
    });
  }

  private buildPlateNo(): void {
    let value = '';
    Object.keys(this.values).forEach((key) => {
      value += this.values[key];
    });
    this.form.patchValue({
      plateNo: value,
    });
    this.isPlateInputTouched = this.form.controls['plateNo'].value.length === 9;
  }
}
