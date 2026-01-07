import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Inject,
  input,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {categoriesProducts} from "../../../../../api/clients/models/templates/black-friday/black-friday-template-data";
import {SwiperDirective} from "../../../../../ui/ui-directive/swiper.directive";
import {SwiperOptions} from "swiper/types";
import {UrlService} from "../../../../services/url.service";

@Component({
  selector: 'app-black-friday-categories-product',
  standalone: true,
  imports: [CommonModule, SwiperDirective],
  templateUrl: './blackFridayCategoriesProduct.component.html',
  styleUrl: './blackFridayCategoriesProduct.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlackFridayCategoriesProductComponent implements OnInit {

  categoriesProducts = input<{
    title: string,
    categories: Array<categoriesProducts>
  }>()

  categoriesList = signal<Array<string>>([]);
  activeCategory = signal<string>('');

  mobileMode = signal<boolean>(false);

  urlService = inject(UrlService);

  config: SwiperOptions = {
    slidesPerView: 1,
    watchSlidesProgress: true,
    updateOnWindowResize: true,
    centerInsufficientSlides: true,
    allowTouchMove: true,
    spaceBetween: 12,
    breakpoints: {
      900: {
        slidesPerView: 6.4,
      },
      700: {
        slidesPerView: 5,
      },
      450: {
        slidesPerView: 4,
      },
      365: {
        slidesPerView: 2.9
      },
      280: {
        slidesPerView: 2.7,
      },
    },
  };

  constructor(@Inject(PLATFORM_ID) public platformID: string) {
  }


  ngOnInit(): void {
    const data = this.categoriesProducts().categories;
    const categoryNames = data.map(item => item.name);
    this.categoriesList.set(categoryNames);

    if (categoryNames.length > 0) {
      this.activeCategory.set(categoryNames[0]);
    }

    if (isPlatformBrowser(this.platformID)) {
      this.mobileMode.set(window.innerWidth <= 1280);
    }
  }

  filteredProducts = computed(() => {
    const active = this.activeCategory();
    const category = this.categoriesProducts().categories.find(cat => cat.name === active);
    return category ? category.products : [];
  })

  filterProduct(item: string) {
    this.activeCategory.set(item);
  }

  openLink(link: string) {
    if (link) {
      this.urlService.handleLink(link);
    }
  }

}
