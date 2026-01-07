import { ChangeDetectionStrategy, Component, effect, forwardRef, input, signal, untracked } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SliderSelectOption } from './models/slider-select-option.interface';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-credit-slider-select',
  templateUrl: './credit-slider-select.component.html',
  styleUrls: ['./credit-slider-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditSliderSelectComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [NgxTrackableIdDirective, NgxButtonComponent, NgTemplateOutlet, NgxDpCarouselComponent, NgxDpCarouselSlideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditSliderSelectComponent implements ControlValueAccessor {
  options = input<SliderSelectOption[] | any>([]);
  version = input<1 | 2>(1);
  reverseOptions = signal<SliderSelectOption[]>([]);
  loading = signal(false);
  nextBtnDisabled = signal<boolean | null>(null);
  prevBtnDisabled = signal<boolean | null>(null);
  carouselIndex = signal<number>(0);
  private isInitialized = signal(false);

  constructor() {
    effect(
      () => {
        const optionsValue = this.options();
        if (optionsValue) {
          this.loading.set(true);
          if (this.options() && this.options()?.length) {
            const reversed = [].concat(this.options()).reverse();
            this.reverseOptions.set(reversed);
          } else {
            this.reverseOptions.set([]);
          }

          // Use longer timeout to ensure carousel is fully initialized
          setTimeout(() => {
            this.loading.set(false);
            this.isInitialized.set(true);
            this.checkNavButtonsStatus(0);
          }, 50);
        }
        untracked(() => {
          this.loading();
          this.reverseOptions();
        });
      },
      { allowSignalWrites: true },
    );
  }

  propagateChange = (_: any) => {};
  propagateTouch = () => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  writeValue(obj: any): void {
    if (obj !== undefined) {
      // Retry logic: if reverseOptions is empty, wait and retry
      const trySetValue = (retryCount = 0) => {
        const index = this.findOptionIndexByValue(obj);

        // If index not found and reverseOptions is empty, retry
        if (index === -1 && this.reverseOptions().length === 0 && retryCount < 5) {
          setTimeout(() => trySetValue(retryCount + 1), 100);
        } else {
          // Always call slideTo - it has retry logic if not initialized yet
          this.slideTo(index);
        }
      };

      trySetValue();
    }
  }

  onChanged(index: number) {
    // Add safety checks
    if (index === undefined || index === null) {
      return;
    }

    try {
      setTimeout(() => {
        this.carouselIndex.set(index); // Keep in sync with carousel position
        const currentOption = this.reverseOptions()[index];
        if (currentOption) {
          this.propagateChange(currentOption.value);
          this.propagateTouch();
          this.checkNavButtonsStatus(index);
        }
      }, 0);
    } catch (error) {
      // Error handled silently
    }
  }

  findOptionIndexByValue(value: any) {
    return this.reverseOptions().findIndex((option) => {
      return option.value === value;
    });
  }

  // Add safe navigation methods
  safeNext() {
    try {
      if (this.isInitialized() && !this.nextBtnDisabled()) {
        const currentIndex = this.carouselIndex();
        if (currentIndex < this.reverseOptions().length - 1) {
          const newIndex = currentIndex + 1;
          this.carouselIndex.set(newIndex);
          this.onChanged(newIndex);
        }
      }
    } catch (error) {
      // Error handled silently
    }
  }

  safePrev() {
    try {
      if (this.isInitialized() && !this.prevBtnDisabled()) {
        const currentIndex = this.carouselIndex();
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1;
          this.carouselIndex.set(newIndex);
          this.onChanged(newIndex);
        }
      }
    } catch (error) {
      // Error handled silently
    }
  }

  private checkNavButtonsStatus(startPosition: number) {
    let nextBtnDisabled = false;
    let prevBtnDisabled = false;

    if (startPosition === 0) {
      prevBtnDisabled = true;
    }
    if (startPosition === this.reverseOptions().length - 1) {
      nextBtnDisabled = true;
    }

    this.nextBtnDisabled.set(nextBtnDisabled);
    this.prevBtnDisabled.set(prevBtnDisabled);
  }

  private slideTo(index: number, tryNo = 0) {
    if (tryNo > 4) {
      return;
    }

    try {
      if (this.isInitialized()) {
        this.carouselIndex.set(index);
        this.onChanged(index);
      } else {
        setTimeout(() => {
          this.slideTo(index, tryNo + 1);
        }, 100);
      }
    } catch (error) {
      // Retry with longer delay
      if (tryNo < 4) {
        setTimeout(() => {
          this.slideTo(index, tryNo + 1);
        }, 200);
      }
    }
  }
}
