import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, output, Renderer2, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchModel } from '@client-monorepo/stores';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { ItemOverview, ItemOverviewComponent } from '@client-monorepo/common/ui-components';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgxBottomSheetHeaderComponent } from '@digipay/ngx-bottom-sheet';
import { Router } from '@angular/router';
import { NgxSwipeDetectorDirective, SwipingEventModel } from '@digipay/ngx-swipe-detector';
import { MapEmptyResultComponent } from '../map-empty-result/map-empty-result.component';
import { MapBranchDetailsComponent } from '../map-branch-details/map-branch-details.component';

@Component({
  selector: 'stores-applet-map-overlay-mobile',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    ItemOverviewComponent,
    NgxBadgeModule,
    NgxSkeletonLoadingComponent,
    NgxBottomSheetHeaderComponent,
    NgxSwipeDetectorDirective,
    MapEmptyResultComponent,
    MapBranchDetailsComponent,
  ],
  templateUrl: './map-overlay-mobile.component.html',
  styleUrl: './map-overlay-mobile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapOverlayMobileComponent {
  // Injections
  router = inject(Router);
  renderer = inject(Renderer2);

  // Inputs
  branchesToShow = input<{ item: ItemOverview; branch: BranchModel }[]>();
  totalAvailableStores = input<number>(0);
  loadingMode = input(false);

  // Models
  selectedBranch = model<BranchModel | undefined>(undefined);
  activeSnapIndex = model(1);

  // Variables
  storesList = viewChild<ElementRef>('storesList');
  snaps = ['50px', '250px', 'calc(100vh - 146px)'];
  private swipeIsLocked = false;

  constructor() {
    effect(() => {
      this.handleOverflowStyle();
    });
  }

  // Outputs
  goBackClicked = output<void>();

  handleStoreClicked(branch: BranchModel): void {
    this.selectedBranch.set(branch);
  }

  handleGoBackClick(): void {
    this.goBackClicked.emit();
    this.selectedBranch.set(undefined);
  }

  goToPrevSnap(): void {
    if (this.activeSnapIndex() === 0) return;
    this.activeSnapIndex.update((x) => x - 1);
  }

  goToNextSnap(): void {
    if (this.activeSnapIndex() === 2) return;
    this.activeSnapIndex.update((x) => x + 1);
  }

  goToSecondSnap() {
    this.activeSnapIndex.set(1);
  }

  handleSwipeTop() {
    if (this.activeSnapIndex() !== 1 || this.swipeIsLocked) return;
    this.goToNextSnap();
  }

  handleSwipeDown() {
    if (this.activeSnapIndex() === 2) {
      return;
    }
    if (this.activeSnapIndex() !== 1 || this.swipeIsLocked) return;
    this.goToPrevSnap();
  }

  handleSwipeStart(event: SwipingEventModel) {
    if (this.activeSnapIndex() === 2 && this.storesList()?.nativeElement.scrollTop < 50 && event.deltaY > 0) {
      this.swipeIsLocked = true;
      this.goToSecondSnap();
      setTimeout(() => {
        this.swipeIsLocked = false;
      }, 500);
      return;
    }
  }

  handleOverflowStyle(): void {
    if (this.activeSnapIndex() === 2) {
      this.unlockScroll();
    } else {
      this.lockScroll();
    }
  }

  lockScroll(): void {
    if (this.storesList()) {
      this.renderer.setStyle(this.storesList()?.nativeElement, 'overflow', 'hidden');
    }
  }

  unlockScroll(): void {
    if (this.storesList()) {
      this.renderer.setStyle(this.storesList()?.nativeElement, 'overflow', 'auto');
    }
  }
}
