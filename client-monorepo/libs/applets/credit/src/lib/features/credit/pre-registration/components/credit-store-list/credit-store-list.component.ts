import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CreditStoreCardComponent } from './credit-store-card/credit-store-card.component';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-store-list',
  templateUrl: './credit-store-list.component.html',
  styleUrls: ['./credit-store-list.component.scss'],
  standalone: true,
  imports: [CreditStoreCardComponent, ApiImageModule, NgxDpCarouselSlideDirective, NgxDpCarouselComponent, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditStoreListComponent {
  storesList = input<any>([]);
  showNavigation = input<boolean>(true);
  slides = input(1);
  itemsPerSlide = input(12);
  currentSlide = signal(0);
  columnCount = input(4);
  showMoreButton = input<boolean>(false);
  showDots = input<boolean>(true);

  moreClicked = output<void>();

  // Calculate total slides needed
  totalSlides = computed(() => {
    const stores = this.storesList();
    if (!stores || stores.length === 0) return 0;
    return Math.ceil(stores.length / this.itemsPerSlide());
  });

  // Generate array of slide indices
  slideIndices = computed(() => {
    return Array.from({ length: this.totalSlides() }, (_, i) => i);
  });

  storeListPerPage = computed(() => {
    return this.getStoresForSlide(this.currentSlide());
  });

  gridColumns = computed(() => {
    return `repeat(${this.columnCount()}, 1fr)`;
  });

  // Check if current slide is the last one
  isLastSlide = computed(() => {
    return this.currentSlide() === this.totalSlides() - 1;
  });

  handleCarouselIndexChange(event: number) {
    if (typeof event === 'number' && event >= 0) {
      this.currentSlide.set(event);
    }
  }

  onMoreClick() {
    this.moreClicked.emit();
  }

  // Get stores for a specific slide
  getStoresForSlide = (slideIndex: number) => {
    const stores = this.storesList();
    if (!stores || stores.length === 0) return [];

    const startIndex = slideIndex * this.itemsPerSlide();
    let endIndex = startIndex + this.itemsPerSlide();

    // If this is the last slide and we're showing the more button, reserve one slot
    const isLastSlide = slideIndex === this.totalSlides() - 1;
    if (isLastSlide && this.showMoreButton()) {
      // Subtract 1 to make room for the more button
      const maxItems = this.itemsPerSlide() - 1;
      endIndex = Math.min(startIndex + maxItems, stores.length);
    } else {
      endIndex = Math.min(endIndex, stores.length);
    }

    return stores.slice(startIndex, endIndex);
  };
}
