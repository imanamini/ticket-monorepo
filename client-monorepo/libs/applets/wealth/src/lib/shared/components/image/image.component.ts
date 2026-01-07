import { HttpClient } from '@angular/common/http';
import { Component, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CacheService } from '../../services/cache.service';
import { LoaderService } from '../../services/loader.service';
import { of, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '../../../components/core/components/base/base.component';
import { checkWealthOrigin } from '../../../components/utils/check-wealth-origin';
import { OnErrorSrcDirective } from '../../directives/image-onerror.directive';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, OnErrorSrcDirective, NgxSkeletonLoadingComponent],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
})
export class ImageComponent extends BaseComponent implements OnInit, OnChanges {
  imageUrl = input<string>();
  defaultImage = input<string>();
  alt = input<string>();
  needSkeleton = input<boolean>(false);
  isLoading = signal(true);
  svgUrl = signal<string | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private cache: CacheService,
    private loaderService: LoaderService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const IMAGE_URL = 'imageUrl';
    if (changes[IMAGE_URL] && changes[IMAGE_URL].currentValue !== changes[IMAGE_URL].previousValue) {
      this.getData();
    }
  }

  getData() {
    this.isLoading.set(true);
    if (!this.imageUrl()) {
      this.isLoading.set(false);
      return null;
    }

    const address = new URL(window.location.origin + (checkWealthOrigin() === 'dgp' ? '/digipay' : '') + '/' + this.imageUrl() || '');
    const cachedKey = address.pathname;
    if (!cachedKey || cachedKey === '/') return;
    if (this.cache.has(cachedKey)) {
      const img = this.cache.get(cachedKey);
      this.createSvgUrl(img);
    } else {
      const isLoaderLoading = this.loaderService.isLoading(cachedKey);
      const afterLoad = this.loaderService.afterLoad(cachedKey);
      if (!isLoaderLoading) {
        this.loaderService.setLoading(cachedKey, true);
        this.http
          .get(cachedKey, {
            responseType: 'text',
          })
          .pipe(
            takeUntil(this.destroyObservable),
            catchError((e) => {
              console.error('this.http.get ======> ', e);
              return of(e);
            }),
          )
          .subscribe((data) => {
            if (data?.ok === false || !data) {
              return;
            } else {
              this.isLoading.set(false);
              this.createSvgUrl(data);
              afterLoad(data);
              if (cachedKey) this.cache.put(cachedKey, data);
            }
          });
      } else {
        this.loaderService.loaded
          .asObservable()
          .pipe(
            takeUntil(this.destroyObservable),
            catchError((e) => {
              console.error('this.loaderService.loaded ======> ', e);
              return of(e);
            }),
          )
          .subscribe((val) => {
            if (val.key === cachedKey) {
              this.createSvgUrl(val.data);
            }
          });
      }
    }
  }

  createSvgUrl(svgContent: string) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    this.svgUrl.set(URL.createObjectURL(blob));
  }
}
