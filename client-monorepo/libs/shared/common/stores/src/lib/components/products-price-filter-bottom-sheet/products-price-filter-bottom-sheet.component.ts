import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ProductsSortAndFilterService } from '../../data-access/services/products-sort-and-filter.service';
import { ProductFilterOptionInterface, ProductFilterOptionTitles } from '../../data-access/models/product-filter-option.interface';
import { NgxSliderComponent } from '@digipay/ngx-slider';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'common-stores-products-price-filter-bottom-sheet',
  standalone: true,
  imports: [CommonModule, NgxSliderComponent, UiFormFieldBuilderModule, FormsModule, ReactiveFormsModule, NgxButtonComponent],
  templateUrl: './products-price-filter-bottom-sheet.component.html',
  styleUrl: './products-price-filter-bottom-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsPriceFilterBottomSheetComponent {
  bottomSheetService = inject(NgxBottomSheetService);
  sortAndFilterService = inject(ProductsSortAndFilterService);
  pageForm!: FormGroup;
  untilDestroy = inject(DestroyRef);
  min = signal(1);
  max = signal(100);
  inited = signal(false);
  priceFilter = computed<ProductFilterOptionInterface | undefined>(() => {
    return this.sortAndFilterService.priceFilter();
  });
  rangeStep = computed(() => {
    return this.priceFilter() ? Math.ceil(((this.priceFilter()?.rangeMax ?? 100) - (this.priceFilter()?.rangeMin ?? 1)) / 100) : 10;
  });
  constructor() {
    this.pageForm = new FormGroup({});
    toObservable(this.priceFilter)
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe({
        next: () => {
          this.min.set(this.priceFilter()?.minValue ?? 0);
          this.max.set(this.priceFilter()?.maxValue ?? 100);
          this.pageForm.addControl(
            'min',
            new FormControl(this.min(), [
              Validators.min((this.priceFilter()?.rangeMin ?? 1) - 1),
              Validators.max((this.priceFilter()?.rangeMax ?? 100) + 1),
            ]),
          );
          this.pageForm.addControl(
            'max',
            new FormControl(this.max(), [
              Validators.min((this.priceFilter()?.rangeMin ?? 1) - 1),
              Validators.max((this.priceFilter()?.rangeMax ?? 100) + 1),
            ]),
          );
          this.setFormValues();
          this.inited.set(true);
        },
      });

    this.pageForm.valueChanges.pipe(takeUntilDestroyed(this.untilDestroy)).subscribe({
      next: (values) => {
        if (values.min && parseInt(values.min) !== this.min() && this.pageForm.valid) {
          this.min.set(+values.min);
        }
        if (values.max && parseInt(values.max) !== this.max() && this.pageForm.valid) {
          this.max.set(+values.max);
        }
      },
    });
  }

  cancel(): void {
    this.bottomSheetService.closeBottomSheet();
  }
  submit(): void {
    let filters: ProductFilterOptionInterface[] = this.sortAndFilterService.data().filters ?? [];
    filters = filters.filter((item) => item.title !== ProductFilterOptionTitles.PRICE);
    filters = [
      ...filters,
      {
        ...this.priceFilter(),
        minValue: this.min(),
        maxValue: this.max(),
      },
    ] as ProductFilterOptionInterface[];
    this.sortAndFilterService.data.update((data) => {
      return {
        ...data,
        filters: JSON.parse(JSON.stringify(filters)),
      };
    });
    this.bottomSheetService.closeBottomSheet();
  }
  setFormValues(): void {
    this.pageForm.setValue({
      min: this.min(),
      max: this.max(),
    });
  }

  handleSliderChange(event: any) {
    this.min.set(event.range.from);
    this.max.set(event.range.to);
    this.setFormValues();
  }
}
