import { Component, ElementRef, inject, OnDestroy, OnInit, Renderer2, signal, viewChild } from '@angular/core';
import { ProductCardComponent } from './product-card/product-card.component';
import { FlokiHeaderComponent } from '../../ui-component/floki-header/floki-header.component';
import { CalloutCheckedComponent } from '../callout-checked/callout-checked.component';
import { NgxIcon } from '@digipay/ngx-icon';
import { BorderColorsEnum, NgxDividerComponent } from '@digipay/ngx-divider';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { ApplicationFormService } from '../../services/application-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../../models/product.model';
import { CalloutModel } from '../../models/callout.model';
import { ApplicationFormModel } from '../../models/application-form.model';
import { DecimalPipe } from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { PrepaymentModalComponent } from './prepayment-modal/prepayment-modal.component';
import { EditDeviceValueComponent } from '../edit-device-value/edit-device-value.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { QueryParamsEnum } from '../../enums/query-params.enum';
import { FlokiRoutesEnum } from '../../enums/floki-routes.enum';
import { DraftModel } from '../../models/draft.model';
import { LazyLoadImageDirective } from '../../common/directives/lazy-load-image.directive';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { MessageService } from '@client-monorepo/common/utilities';
import { BottomSheetService } from '../../../../data-access/services/bottom-sheet.service';
import { BaseComponent } from '../../../../components/base/base.component';
import { LoginService } from '../../../../data-access/services/user-services/login.service';
import { BottomSheetBoxComponent } from '../../../../components/bottom-sheet-box/bottom-sheet-box.component';

@Component({
  selector: 'plp',
  standalone: true,
  imports: [
    ProductCardComponent,
    FlokiHeaderComponent,
    CalloutCheckedComponent,
    NgxIcon,
    NgxDividerComponent,
    NgxButtonComponent,
    PipesModule,
    DecimalPipe,
    NgxSkeletonLoadingComponent,
    LazyLoadImageDirective,
  ],
  templateUrl: './plp.component.html',
  styleUrl: './plp.component.scss',
})
export class PlpComponent extends BaseComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  messageService = inject(MessageService);
  renderer = inject(Renderer2);
  public formId = signal('');
  selectedProduct = signal<ProductModel>(null);
  coverages = signal<CalloutModel[]>([]);
  formApplicationInfo = signal<ApplicationFormModel>(null);
  protected readonly BorderColorsEnum = BorderColorsEnum;
  private bottomSheetService = inject(BottomSheetService);
  private applicationFormService = inject(ApplicationFormService);
  private loginService = inject(LoginService);
  private productContainerTemp = viewChild<ElementRef<HTMLDivElement>>('container_product_temp');

  private isDown = false;
  private startX: number;
  private scrollLeft: number;

  ngOnInit(): void {
    this.readQueryParam();
    this.getAvailableProducts();
  }

  protected editDeviceValue(): void {
    super.addSubscription(
      this.bottomSheetService
        .open(BottomSheetBoxComponent, {
          component: EditDeviceValueComponent,
          name: 'EditDeviceValueBottomSheet',
          data: {
            formId: this.formId(),
          },
        })
        .afterDismissed()
        .subscribe({
          next: (res: ApplicationFormModel) => {
            if (res) {
              this.getAvailableProducts();
            }
          },
        }),
    );
  }

  private readQueryParam(): void {
    const formIdExistInSnapShot = this.activatedRoute.snapshot.queryParamMap.get(QueryParamsEnum.ApplicationId);
    this.formId.set(formIdExistInSnapShot);
  }

  private getProductIdFromUrl(): string | null {
    return this.activatedRoute.snapshot.queryParamMap.get('productId');
  }

  private getAvailableProducts(): void {
    const subscription = this.applicationFormService.getAvailableProducts(this.formId()).subscribe({
      next: (res) => {
        this.formApplicationInfo.set(res.result);
        const productIdFromUrl = this.getProductIdFromUrl();
        if (productIdFromUrl) {
          const productIndex = this.formApplicationInfo()?.products?.findIndex((product) => product.id === productIdFromUrl);
          if (productIndex !== -1) {
            this.onSelectProduct(this.formApplicationInfo().products[productIndex], productIndex);
            return;
          }
        } else {
          this.selectFirstItem();
        }
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
    super.addSubscription(subscription);
  }

  protected onSelectProduct(product: ProductModel, index: number): void {
    this.selectedProduct.set(product);
    this.generateCoverage();
    this.updateSelectedElementPosition(index);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { productId: product.id },
      queryParamsHandling: 'merge',
    });
  }

  protected goToTermsAndCondition(): void {
    super.addSubscription(
      this.bottomSheetService
        .open(
          BottomSheetBoxComponent,
          {
            component: TermsConditionsComponent,
            name: 'TermsConditionsBottomSheet',
            data: {
              appId: this.formId(),
              productId: this.selectedProduct().id,
            },
          },
          { fullPage: true },
        )
        .afterDismissed()
        .subscribe({}),
    );
  }

  protected onBack(): void {
    this.router.navigate([FlokiRoutesEnum.Floki]).then();
  }

  protected onSaveProductToDraft(): void {
    const subscription = this.applicationFormService.setDrafts(this.formId(), this.selectedProduct().id).subscribe({
      next: (res) => this.openPrepaymentModal(res.result),
      error: (e) => {
        this.messageService.showErrorIfExists(e);
      },
    });
    super.addSubscription(subscription);
  }

  protected onStartSliderDrag(e: MouseEvent): void {
    e.preventDefault();
    this.isDown = true;
    this.renderer.addClass(this.productContainerTemp()?.nativeElement, 'drag-slider');
    this.startX = e.pageX - this.productContainerTemp()?.nativeElement.offsetLeft;
    this.scrollLeft = this.productContainerTemp()?.nativeElement.scrollLeft;
  }

  protected onEndSliderDrag(e: MouseEvent): void {
    e.preventDefault();
    this.isDown = false;
    this.renderer.removeClass(this.productContainerTemp()?.nativeElement, 'drag-slider');
  }

  protected onMoveSliderDrag(e: MouseEvent): void {
    if (!this.isDown) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - this.productContainerTemp()?.nativeElement.offsetLeft;
    const walk = (this.productContainerTemp().nativeElement.scrollLeft = this.scrollLeft - (x - this.startX) * 1.1); // scroll-fast
  }

  private selectFirstItem(): void {
    this.onSelectProduct(this.formApplicationInfo().products[0], 0);
  }

  private updateSelectedElementPosition(index: number): void {
    this.productContainerTemp()?.nativeElement?.scrollTo({
      top: 0,
      left: -(index * 154),
      behavior: 'smooth',
    });
  }

  private generateCoverage(): void {
    this.coverages.set([]);
    this.selectedProduct().coverageAvailabilities.forEach((res) => {
      this.coverages().push({
        title: `پوشش ${100 - res.coverageBasis} درصدی ${res.coverageTypeName}`,
        subTitle: res.description,
      });
    });
  }

  private openPrepaymentModal(draft: DraftModel): void {
    this.bottomSheetService.open(BottomSheetBoxComponent, {
      component: PrepaymentModalComponent,
      name: 'PrepaymentBottomSheet',
      data: { draft, product: this.selectedProduct() },
    });
  }
}
