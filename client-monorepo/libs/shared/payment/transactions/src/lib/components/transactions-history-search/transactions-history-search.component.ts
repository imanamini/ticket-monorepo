import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { AppNameService, SetOfObjects, StorageService } from '@client-monorepo/common/utilities';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionSearchPayloadRestrictionItemInterface } from '../../data-access/models/transaction-search-payload-restriction-item.interface';
import { allTransactionsGroup } from '../../data-access/constants/transaction-groups.const';
import { TransactionTypeGroupInterface } from '../../data-access/models/transaction-type-group.interface';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxCheckboxComponent } from '@digipay/ngx-checkbox';
import { pillarTransactionsGroup } from '../../data-access/constants/transaction-groups-pillar.const';

@Component({
  selector: 'payment-transactions-transactions-history-search',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, NgxButtonComponent, NgxCheckboxComponent],
  templateUrl: './transactions-history-search.component.html',
  styleUrl: './transactions-history-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsHistorySearchComponent implements OnInit {
  bottomSheetService = inject(NgxBottomSheetService);
  dateRanges = signal([
    {
      id: 1,
      tag: 'همه',
      from: null,
      to: null,
      active: true,
    },
    {
      id: 2,
      tag: 'یک ماه',
      from: new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0),
      to: new Date().setHours(23, 59, 59, 999),
      active: false,
    },
    {
      id: 3,
      tag: 'سه ماه',
      from: new Date(new Date().setDate(new Date().getDate() - 90)).setHours(0, 0, 0, 0),
      to: new Date().setHours(23, 59, 59, 999),
      active: false,
    },
    {
      id: 4,
      tag: 'بازه دلخواه',
      active: false,
    },
  ]);
  activeDateRange = computed(() => this.dateRanges().find((range) => range.active));
  storageService = inject(StorageService);
  appNameService = inject(AppNameService);
  transactionSides = signal([
    {
      id: 1,
      tag: 'همه',
      active: true,
      field: null,
      filters: this.appNameService.isPillar() ? pillarTransactionsGroup : allTransactionsGroup,
    },
    {
      id: 2,
      tag: 'پرداخت',
      active: false,
      field: 'source.userId',
      filters: this.appNameService.isPillar()
        ? pillarTransactionsGroup
        : allTransactionsGroup.filter((item) => ['expense', 'both'].indexOf(item.type) !== -1),
    },
    {
      id: 3,
      tag: 'دریافت',
      active: false,
      field: 'destination.userId',
      filters: this.appNameService.isPillar()
        ? pillarTransactionsGroup
        : allTransactionsGroup.filter((item) => ['income', 'both'].indexOf(item.type) !== -1),
    },
  ]);
  filtersToShow = signal<Array<TransactionTypeGroupInterface>>(allTransactionsGroup);
  restrictions = new SetOfObjects<TransactionSearchPayloadRestrictionItemInterface>((restriction) => restriction?.field ?? '');
  formGroup = new FormGroup({
    exerciseDate: new FormGroup({
      min: new FormControl<number | null>(null),
      max: new FormControl<number | null>(null),
    }),
    ownerSide: new FormControl<string | null>(null),
    types: new FormArray<any>([]),
  });

  constructor() {
    const data = this.bottomSheetService.data();
    if (data['restrictions']) {
      data['restrictions'].forEach((restriction: TransactionSearchPayloadRestrictionItemInterface) => {
        this.restrictions.add(restriction);
      });
    }
  }
  ngOnInit() {
    this.initForm();
    this.filtersToShow.set(this.appNameService.isPillar() ? pillarTransactionsGroup : allTransactionsGroup);
  }

  initForm(): void {
    if (this.restrictions.has({ field: 'exerciseDate' })) {
      const restriction = this.restrictions.get({ field: 'exerciseDate' });
      if (restriction?.minValue) {
        this.formGroup.controls.exerciseDate.controls.min.setValue(parseInt(restriction.minValue.toString()));
      }
      if (restriction?.maxValue) {
        this.formGroup.controls.exerciseDate.controls.max.setValue(parseInt(restriction.maxValue.toString()));
      }
      if (restriction?.minValue && restriction?.maxValue) {
        this.changeRange(parseInt(restriction.minValue.toString()), parseInt(restriction.maxValue.toString()));
      }
    }
    if (this.restrictions.has({ field: 'source.userId' })) {
      this.formGroup.controls.ownerSide.setValue('source.userId');
      this.changeSide('source.userId');
    } else if (this.restrictions.has({ field: 'destination.userId' })) {
      this.formGroup.controls.ownerSide.setValue('destination.userId');
      this.changeSide('destination.userId');
    }
    if (this.restrictions.has({ field: 'type' })) {
      const types = this.restrictions.get({ field: 'type' });
      const formArray = this.formGroup.get('types') as FormArray;
      types?.restrictions?.forEach((restriction) => {
        formArray.push(new FormControl(restriction.value));
      });
    }
  }

  changeRange(from: number | null | undefined, to: number | null | undefined, id: number | null = null): void {
    let ranges = [...this.dateRanges()];
    if (id === 4) {
      const activeDataRange = ranges.find((range) => range.active);
      if (activeDataRange) {
        activeDataRange.active = false;
      }
      ranges[3].active = true;
    } else {
      ranges = ranges.map((range) => {
        if (range.from === from && range.to === to) {
          range.active = true;
          this.formGroup.controls.exerciseDate.controls.min.setValue(range.from ?? null);
          this.formGroup.controls.exerciseDate.controls.max.setValue(range.to ?? null);
        } else {
          range.active = false;
        }
        return range;
      });
    }
    this.dateRanges.set(ranges);
    if (this.restrictions.has({ field: 'exerciseDate' }) && !this.activeDateRange()) {
      this.dateRanges.update((ex) => {
        ex[3].active = true;
        return [...ex];
      });
    }
  }

  changeSide(field: string | null): void {
    let sides = [...this.transactionSides()];
    sides = sides.map((side) => {
      if (side.field === field) {
        side.active = true;
        this.formGroup.controls.ownerSide.setValue(side.field);
        this.filtersToShow.set(side.filters);
        (this.formGroup.get('types') as FormArray).clear();
      } else {
        side.active = false;
      }
      return side;
    });
    this.transactionSides.set(sides);
  }

  applyFilter(apply: boolean): void {
    if (apply) {
      const values = this.formGroup.value;
      if (values.exerciseDate?.min || values.exerciseDate?.max) {
        const restriction: TransactionSearchPayloadRestrictionItemInterface = {
          field: 'exerciseDate',
          type: 'range',
        };
        if (values.exerciseDate?.min) {
          restriction.minValue = values.exerciseDate.min;
        }
        if (values.exerciseDate?.max) {
          restriction.maxValue = values.exerciseDate.max;
        }
        this.restrictions.delete(restriction);
        this.restrictions.add(restriction);
      } else {
        this.restrictions.delete({ field: 'exerciseDate' });
      }
      if (values.ownerSide) {
        const restriction: TransactionSearchPayloadRestrictionItemInterface = {
          field: values.ownerSide,
          type: 'simple',
          value: this.storageService.getUserId(),
          operation: 'eq',
        };
        this.restrictions.delete({ field: 'source.userId' });
        this.restrictions.delete({ field: 'destination.userId' });
        this.restrictions.add(restriction);
      } else {
        this.restrictions.delete({ field: 'source.userId' });
        this.restrictions.delete({ field: 'destination.userId' });
      }
      if (values.types && values.types.length) {
        const restrictions: TransactionSearchPayloadRestrictionItemInterface = {
          field: 'type',
          type: 'or',
          restrictions: [],
        };
        values.types.forEach((typ: number) => {
          restrictions.restrictions?.push({
            field: 'type',
            type: 'simple',
            operation: 'eq',
            value: typ,
          });
        });
        this.restrictions.delete({ field: 'type' });
        this.restrictions.add(restrictions);
      } else {
        this.restrictions.delete({ field: 'type' });
      }
      this.bottomSheetService.outputData.set(this.restrictions.values());
      this.bottomSheetService.closeBottomSheet();
    } else {
      this.bottomSheetService.outputData.set(null);
      this.bottomSheetService.closeBottomSheet();
    }
  }

  isGroupChecked(group: TransactionTypeGroupInterface): boolean {
    const value = this.formGroup.value;
    return group.types.every((typ) => value?.types?.includes(typ) ?? false);
  }

  toggleGroup(value: any, group: TransactionTypeGroupInterface): void {
    if (value) {
      group.types.forEach((typ) => {
        (this.formGroup.get('types') as FormArray).push(new FormControl(typ));
      });
    } else {
      group.types.forEach((typ) => {
        const values = this.formGroup.value.types;
        const index = values.indexOf(typ);
        if (index != -1) {
          (this.formGroup.get('types') as FormArray).removeAt(index);
        }
      });
    }
  }
}
