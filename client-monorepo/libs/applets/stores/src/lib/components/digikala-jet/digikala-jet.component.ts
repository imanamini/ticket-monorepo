import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigikalaJetService } from '../../data-access/services/digikala-jet.service';
import { ExampleDigikalaJetApiResponse } from '../../data-access/models/digikala-jet.model';
import { rangeCreator } from '@client-monorepo/common/utilities';
import { HorizontalScrollComponent, TitleSummaryComponent } from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ProductInterface, ProductPreviewComponent } from '@client-monorepo/stores';

@Component({
  selector: 'stores-applet-digikala-jet',
  standalone: true,
  imports: [
    CommonModule,
    HorizontalScrollComponent,
    NgxButtonComponent,
    NgxSkeletonLoadingComponent,
    ProductPreviewComponent,
    TitleSummaryComponent,
  ],
  templateUrl: './digikala-jet.component.html',
  styleUrl: './digikala-jet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DigikalaJetService],
})
export class DigikalaJetComponent implements OnInit {
  isLoading = computed(() => !this.digikalaJetProducts());
  digikalaJetService = inject(DigikalaJetService);
  digikalaJetProducts = signal<ProductInterface[] | undefined>(undefined);
  rangeCreator = rangeCreator;

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.digikalaJetService.getProducts().subscribe({
      next: (res) => {
        this.digikalaJetProducts.set(this.digikalaJetService.mapDigikalaJetProductsToOurProducts(res.data.widgets[1].data.products));
      },
      error: () => {
        this.digikalaJetProducts.set(
          this.digikalaJetService.mapDigikalaJetProductsToOurProducts(ExampleDigikalaJetApiResponse.data.widgets[1].data.products),
        );
      },
    });
  }
}
