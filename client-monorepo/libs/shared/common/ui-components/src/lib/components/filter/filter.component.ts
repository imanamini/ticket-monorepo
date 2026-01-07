import { ChangeDetectionStrategy, Component, computed, input, output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalScrollComponent } from '../horizontal-scroll/horizontal-scroll.component';
import { NgxChipComponent } from '@digipay/ngx-chip';

@Component({
  selector: 'common-ui-components-filter',
  standalone: true,
  imports: [CommonModule, HorizontalScrollComponent, NgxChipComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FilterComponent {
  @ViewChild('scrollComponent') scrollComponent!: HorizontalScrollComponent;
  classes = input<string>('');
  noPadding = input(false);
  buttonIcon = input<string>('transaction');
  hasIcon = input<boolean>(true);
  buttonLabel = input<string>('فیلترها');
  size = input<'LARGE' | 'MEDIUM' | 'SMALL'>('SMALL');
  isSticky = input<boolean>(true);
  isActive = input<boolean>(false);
  topPosition = input<string>('0');
  isActiveDefault = input<boolean>(false);
  classesForDeActiveItem = 'text-onback-high border-color-light';
  classesForActiveItem = 'text-onback-brand border-color-brand';
  componentStyle = computed(() => {
    if (this.isSticky()) {
      return {
        position: 'sticky',
        top: this.topPosition(),
      };
    } else {
      return {};
    }
  });
  scrollToStartScroll(): void {
    this.scrollComponent.scrollToStart();
  }
  toggleFilter = output<void>();
}
