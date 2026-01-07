import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemInSlider } from '../../data-access/models/item-slider.type';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { makeItemsGroup, rangeCreator } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';
import { FramedIconComponent } from '../framed-icon/framed-icon.component';
import { ApiService, RequestBuilder, RequestTypeEnum } from '@client-monorepo/common/network';
import { map, Observable, tap } from 'rxjs';
import { SelectedItemsEndpointConfig } from '../../data-access/models/selected-items-endpoint-config';
import { Store } from '@client-monorepo/stores';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { ServiceImagesType } from '@client-monorepo/common/service-data';

@Component({
  selector: 'common-ui-components-services-or-stores-slider',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    NgxSkeletonLoadingComponent,
    FramedIconComponent,
    NgxDpCarouselSlideDirective,
    NgxDpCarouselComponent,
  ],
  templateUrl: './services-or-stores-slider.component.html',
  styleUrl: './services-or-stores-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesOrStoresSliderComponent {
  mode = input<'normal' | 'api'>('normal');
  items = input<ItemInSlider[]>([]);
  itemPerSlide = input<number>(12);
  imageType = input<'logo' | 'normal'>('normal');
  endpoint = input<SelectedItemsEndpointConfig | undefined>();
  endpointItems = signal<ItemInSlider[]>([]);
  isCarouselSwiping = signal<boolean>(false);
  page = 0;
  numberOfFakePagesAtStart = 0;
  numberOfFakePagesAtEnd = 0;

  indexChanged = output<void>();

  slicedItems = computed<ItemInSlider[][]>(() => this.makeItemsGroup());
  rangeCreator = rangeCreator;
  ServiceImagesType = ServiceImagesType;

  router = inject(Router);
  apiService = inject(ApiService);

  constructor() {
    effect(() => {
      if (this.mode() === 'api') {
        this.makeApiCall().subscribe((res) => {
          this.endpointItems.set([...this.makeFakeItems('start'), ...res, ...this.makeFakeItems('end')]);
        });
      }
    });
  }

  makeItemsGroup(): ItemInSlider[][] {
    if (this.items().length > 0) {
      return makeItemsGroup(this.items(), this.itemPerSlide());
    } else if (this.endpointItems().length > 0) {
      return makeItemsGroup(this.endpointItems(), this.itemPerSlide());
    } else {
      return [];
    }
  }

  makeFakeItems(mode: 'start' | 'end'): ItemInSlider[] {
    const fakeItems: ItemInSlider[] = [];
    let numberOfFakePages;
    if (mode === 'start') {
      numberOfFakePages = this.numberOfFakePagesAtStart;
    } else {
      numberOfFakePages = this.numberOfFakePagesAtEnd;
    }
    for (let i = 0; i < numberOfFakePages * this.itemPerSlide(); i++) {
      fakeItems.push({
        isFake: true,
      });
    }
    return fakeItems;
  }

  makeApiCall(): Observable<Store[]> {
    const query = this.endpoint()?.url + '?page=' + this.page + '&size=' + this.itemPerSlide() + (this.page === 0 ? '&count=true' : '');
    const request = new RequestBuilder(RequestTypeEnum.POST, query, this.endpoint()?.body).enableCache(1000 * 60 * 10);

    return this.apiService.call<any>(request).pipe(
      tap((res) => {
        this.numberOfFakePagesAtEnd = res.totalPages - (this.page + 1);
        this.numberOfFakePagesAtStart = this.page;
      }),
      map((res) => res.stores),
      map((stores) =>
        stores.map((s: any) => {
          return {
            title: s.title,
            image: s.logoImageId,
            url: '/stores/' + s.title,
          };
        }),
      ),
    );
  }

  navigateToPage(item: ItemInSlider): void {
    if (this.isCarouselSwiping()) {
      return;
    }
    if (item.url) {
      this.router.navigate([encodeURI(item.url)]);
    }
  }

  changeIndex(event: number): void {
    if (event <= 0) {
      return;
    }
    if (this.mode() === 'api') {
      this.page = event;
      this.makeApiCall().subscribe((res) => {
        this.endpointItems.update(() => {
          const start = this.page * this.itemPerSlide();
          for (let i = 0; i < this.itemPerSlide(); i++) {
            this.endpointItems()[i + start] = res[i];
          }
          return [...this.endpointItems()];
        });
      });
    } else {
      this.indexChanged.emit();
    }
  }

  handleCarouselSwiping(event: boolean): void {
    this.isCarouselSwiping.set(event);
  }
}
