import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { StoreCategory, StoreCategoryTitleMapper } from '@client-monorepo/stores';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';

@Component({
  selector: 'stores-applet-stores-category',
  standalone: true,
  imports: [CommonModule, ApiImageModule, NgOptimizedImage, NgxRadioButtonComponent],
  templateUrl: './stores-category.component.html',
  styleUrl: './stores-category.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoresCategoryComponent {
  // Inputs
  category = input.required<StoreCategory>();
  size = input<'LARGE' | 'MEDIUM'>('MEDIUM');
  isChecked = model<boolean>(false);
  storeCategoryTitleMapper = StoreCategoryTitleMapper;

  // Outputs
  checkChanged = output<{ isChecked: boolean; id: string }>();

  // Variables
  generatedStyles = computed(() => this.sizeToStyleMapper[this.size()]);
  sizeToStyleMapper = {
    LARGE: { wrapperClasses: 'border-none py-micro w-200', imageSize: 64 },
    MEDIUM: { wrapperClasses: 'border-200 border-color-light py-tiny', imageSize: 56 },
  };

  check(id: number): void {
    this.isChecked.update((v) => !v);
    this.checkChanged.emit({ isChecked: this.isChecked(), id: String(id) });
  }
}
