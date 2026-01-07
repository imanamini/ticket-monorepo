import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OkalaService } from '../../data-access/services/okala-service';
import { OkalaCarousel } from '../../data-access/models/okala.model';
import { NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { map } from 'rxjs';
import { OkalaCarouselComponent } from '../../components/okala-carousel/okala-carousel.component';

@Component({
  selector: 'stores-applet-okala-carousel-details',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, OkalaCarouselComponent],
  templateUrl: './okala-carousel-details.component.html',
  styleUrl: './okala-carousel-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OkalaCarouselDetailsComponent implements OnInit {
  mainCarouselId = 0;
  okalaService = inject(OkalaService);
  activatedRoute = inject(ActivatedRoute);
  title = signal('');
  subCarousels = signal<Partial<OkalaCarousel>[] | undefined>(undefined);
  router = inject(Router);

  ngOnInit(): void {
    this.mainCarouselId = +this.activatedRoute.snapshot.params['carousel-id'];
    if (this.mainCarouselId) {
      this.getCarouselDetails();
    }
  }

  getCarouselDetails(): void {
    this.okalaService.getSingleCarousel(this.mainCarouselId).subscribe((res) => this.title.set(res.carousel.title));
    this.okalaService
      .getSubCarousels(this.mainCarouselId)
      .pipe(
        map((res) => {
          const carousels: Partial<OkalaCarousel>[] = [];
          res.entities.forEach((entity) => {
            carousels.push({
              title: 'افق کوروش ' + entity.storeName,
              products: entity.products,
            });
          });
          return carousels;
        }),
      )
      .subscribe((res) => this.subCarousels.set(res));
  }

  goBack(): void {
    this.router.navigate(['/stores']);
  }
}
