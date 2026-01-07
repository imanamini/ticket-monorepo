import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { OkalaService } from '../../data-access/services/okala-service';
import { Coordination, LocationService, LocationStatusEnum } from '@client-monorepo/common/location-management';
import { map } from 'rxjs';
import { OkalaCarouselComponent } from '../okala-carousel/okala-carousel.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { StoresService } from '@client-monorepo/stores';

@Component({
  selector: 'stores-applet-okala-carousels',
  standalone: true,
  templateUrl: './okala-carousels.component.html',
  styleUrl: './okala-carousels.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OkalaCarouselComponent],
})
export class OkalaCarouselsComponent implements OnInit {
  nearByCarousels = computed(() => this.okalaService.nearByCarousels());
  nearByCarouselsCount = computed(() => this.okalaService.nearByCarouselsCount());
  okalaService = inject(OkalaService);
  locationsService = inject(LocationService);
  destroyRef = inject(DestroyRef);
  location!: { coordination: Coordination; state: LocationStatusEnum };
  storeService = inject(StoresService);

  ngOnInit(): void {
    if (!this.location) {
      this.getLocation();
    } else {
      this.getNearByStores();
    }
  }

  getLocation(): void {
    this.locationsService
      .getGuaranteedLocation(false, this.storeService.ttlForOptionalLocation, 2 * 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((location: { coordination: Coordination; state: LocationStatusEnum }) => {
        this.location = location;
        this.getNearByStores();
      });
  }

  getNearByStores(): void {
    const coordination = this.location.coordination;
    this.okalaService
      .getNearbyStores(coordination)
      .pipe(
        map((res) => {
          const ids: number[] = [];
          res.data.stores.forEach((store) => {
            ids.push(store.storeId);
          });
          return ids;
        }),
      )
      .subscribe((res) => {
        this.okalaService.nearByStoreId.set(res);
        this.getCarousels();
      });
  }

  getCarousels(): void {
    this.okalaService
      .getCarousels()
      .pipe(
        map((res) => {
          this.okalaService.nearByCarouselsCount.set(res.carousels.length);
          return res.carousels;
        }),
        map((res) => res.filter((c) => c.carouselTypeId === 1)),
      )
      .subscribe((res) => {
        this.okalaService.nearByCarousels.set(structuredClone(res));
      });
  }

  protected readonly rangeCreator = rangeCreator;
}
