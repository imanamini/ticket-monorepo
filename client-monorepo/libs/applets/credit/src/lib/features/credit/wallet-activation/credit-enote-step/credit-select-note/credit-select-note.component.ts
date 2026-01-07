import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NOTE_TYPES_Mapper, NoteTypes } from '../../../data-access/models/credit/activation/enote-step/enote-types.enum';
import { ActivatedRoute } from '@angular/router';
import { CreditCollateralOptionModel } from '../../../pre-registration/pre-registration-steps/pre-registration-step-collateral/credit-collateral-option.model';
import { CreditCollateralInfoModel } from '../../../pre-registration/pre-registration-steps/pre-registration-step-collateral/credit-collateral-info.model';
import { CreditCollateralStepsPreviewBottomSheetComponent } from '../../../pre-registration/components/credit-collateral-steps-preview-bottom-sheet/credit-collateral-steps-preview-bottom-sheet.component';
import { CreditCacheService } from '../../../data-access/services/credit-cache.service';
import { CreditNoteCacheKeys } from '../credit-enote-gateway/credit-note-cache-keys';
import { GetEnoteSelectConfigResponse } from '../../../data-access/models/credit/activation/enote-step/get-enote-select-config.response';
import { CreditNoteService } from '../credit-note.service';
import { PreRegistrationStepCollateralInfoComponent } from '../../../pre-registration/pre-registration-steps/pre-registration-step-collateral/pre-registration-step-collateral-info/pre-registration-step-collateral-info.component';
import { SelectionBoxComponent } from '../../../components/selection-box/selection-box.component';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { CreditPageLoadingComponent } from '../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../components/credit-app-bar/credit-app-bar.component';
import { CreditScrollableViewComponent } from '../../../components/credit-scrollable-view/credit-scrollable-view.component';

type CollateralOptionsObject = Record<
  string,
  {
    value: any;
    title: string;
    disabled?: boolean;
    tooltip?: string;
    type: NoteTypes;
    listOption?: any;
    collateralAmount: number[];
  }
>;

@Component({
  selector: 'app-credit-select-note',
  templateUrl: './credit-select-note.component.html',
  styleUrls: ['./credit-select-note.component.scss'],
  standalone: true,
  imports: [
    PreRegistrationStepCollateralInfoComponent,
    SelectionBoxComponent,
    NgxButtonComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
    CreditScrollableViewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSelectNoteComponent implements OnInit {
  gettingConfig = signal<boolean | null>(null);
  creditId!: string;
  fundProviderCode!: number;
  pageTitle = signal<string | null>(null);
  selectedCollateralType = signal<NoteTypes | null>(null);
  selectedCollateralTypeRadio = signal<NoteTypes | null>(null);
  collateralOptions = signal<CreditCollateralOptionModel[]>([]);
  infoMapper = signal<Record<string, CreditCollateralInfoModel>>({});
  bottomSheet = inject(NgxBottomSheetService);
  activatedRoute = inject(ActivatedRoute);
  cache = inject(CreditCacheService);
  noteService = inject(CreditNoteService);

  ngOnInit() {
    this.fundProviderCode = +this.activatedRoute.snapshot.params['fundProviderCode'];
    this.creditId = this.activatedRoute.snapshot.params['creditId'];
    this.getConfig();
  }

  getConfig() {
    if (this.cache.has(CreditNoteCacheKeys.config)) {
      const configInfo = this.cache.get(CreditNoteCacheKeys.config);
      this.getConfigHandler(configInfo);
    } else {
      this.noteService.resolve(this.fundProviderCode, this.creditId);
    }
  }

  getConfigHandler(configInformation: GetEnoteSelectConfigResponse) {
    this.pageTitle.set(configInformation.pageTitle);
    const collateralOptionsObject: CollateralOptionsObject = {};
    for (const page of configInformation.pages) {
      collateralOptionsObject[NOTE_TYPES_Mapper[+page.type]] = {
        collateralAmount: [page.amount],
        value: NOTE_TYPES_Mapper[+page.type],
        title: page.title,
        type: NOTE_TYPES_Mapper[+page.type],
        disabled:
          (!collateralOptionsObject[NOTE_TYPES_Mapper[+page.type]] || collateralOptionsObject[NOTE_TYPES_Mapper[+page.type]].disabled) &&
          !page.enable,
      };
      this.infoMapper.update((mapper) => ({
        ...mapper,
        [NOTE_TYPES_Mapper[+page.type]]: {
          collateralAmount: [page.amount],
          hasCollateralAmount: !!page.amount,
          registerType: [NOTE_TYPES_Mapper[+page.type]],
          registerCost: [undefined],
          hasRegisterCost: false,
          groupId: [page.title],
          collateralDetailTitle: 'جزئیات طرح با ' + page.title,
          calloutMessage: {
            title: 'مراحل',
            description: page.descriptions,
          },
        },
      }));

      this.collateralOptions.set(
        Object.values(collateralOptionsObject).map((item) => {
          item.listOption = {
            label: item.title,
            value: '',
            selected: false,
          };
          return item;
        }),
      );
      this.gettingConfig.set(false);
    }

    if (this.collateralOptions().length === 1 && !this.collateralOptions()[0].disabled) {
      this.onChangeCollateral(this.collateralOptions()[0].value);
    }
  }

  onChangeCollateral(collateralType: NoteTypes) {
    this.selectedCollateralType.set(collateralType);
    this.selectedCollateralTypeRadio.set(collateralType);

    this.collateralOptions.update((items) =>
      items.map((item) => {
        item.listOption = { ...item.listOption, selected: item.value === collateralType };
        return item;
      }),
    );
  }

  previewSteps(collateral: { value: string; title: string }) {
    this.bottomSheet.openBottomSheet(CreditCollateralStepsPreviewBottomSheetComponent, collateral, {
      noPadding: true,
    });
  }

  onSubmit(): void {
    this.noteService.goNotePage(this.fundProviderCode, this.creditId, this.selectedCollateralType()!);
  }

  closeStep(): void {
    this.noteService.closeStep(this.fundProviderCode, this.creditId);
  }
}
