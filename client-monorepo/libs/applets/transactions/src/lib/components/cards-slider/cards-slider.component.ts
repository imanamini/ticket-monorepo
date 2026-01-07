import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardActionOverview } from '@client-monorepo/payment/card-data';
import { cardsSliderAnimations } from './cards-slider.animations';
import { SwipePointEventModel, SwipingEventModel } from '@client-monorepo/common/utilities';
import { NgxCard } from '@digipay/ngx-card';
import { CardCtaTypes } from '../../data-access/constants/card-cta-types.const';
import { convertNonEnglishDigits, toPersianChar } from '@digipay/strings';
import { UserApiService } from '@client-monorepo/common/user';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxSwipeDetectorDirective } from '@digipay/ngx-swipe-detector';
import { AccountStatus } from '@client-monorepo/common/user-assets';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CardStatus } from '@client-monorepo/digipay-card';
import { NgxBadgeStatus } from '@digipay/ngx-badge/lib/ngx-badge.type';
import { cardIcons } from '../../data-access/constants/cardIcons';

@Component({
  selector: 'transactions-applet-cards-slider',
  standalone: true,
  imports: [CommonModule, NgxCard, PipesModule, NgxSwipeDetectorDirective, NgxBadgeModule],
  templateUrl: './cards-slider.component.html',
  styleUrl: './cards-slider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: cardsSliderAnimations,
})
export class CardsSliderComponent implements OnInit, OnDestroy {
  // Injections
  userApiService = inject(UserApiService);
  cdr = inject(ChangeDetectorRef);

  // View Children
  cardItems = viewChildren<ElementRef>('cardItem');

  // Inputs
  cards = input<CardActionOverview[]>([]);
  cardsType = input.required<CardCtaTypes>();
  isCollapsed = input<boolean>(false);
  disableVerticalScroll = input<boolean>(false);

  // Models
  currentIndex = signal<number>(0);

  // Outputs
  cardClicked = output();
  isAnimationRunning = output<boolean>();
  activeIndexChanged = output<number>();

  // Variables
  isActive = signal(true);
  indexesToShow = signal<number[]>([]);
  userNameForWalletCards = signal<string>('');
  isAnimating = false;
  isSwiping = false;
  movedBySwipe = 0;
  isMovedBySwipe = false;
  isSwipingHorizontally = false;
  private isDestroyed = false;
  cardsTypeMapper: Record<CardCtaTypes, 'bank' | 'credit' | 'bnpl' | 'wallet'> = {
    [CardCtaTypes.BNPL]: 'bnpl',
    [CardCtaTypes.CREDIT]: 'credit',
    [CardCtaTypes.BANK_CARDS]: 'bank',
    [CardCtaTypes.WALLET]: 'wallet',
    [CardCtaTypes.DP_CARD]: 'bank',
  };

  constructor() {
    effect(
      () => {
        if (this.cards()?.length > 0) {
          this.generateCardsToShow();
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.getUserProfile();
  }
  ngOnDestroy() {
    this.isDestroyed = true;
  }

  getUserProfile(): void {
    this.userApiService.getProfile().subscribe({
      next: (result) => {
        this.userNameForWalletCards.set(result.name + ' ' + result.surname);
      },
    });
  }

  generateCardsToShow(): void {
    if (this.indexesToShow().length === 0) {
      this.indexesToShow.set([0, 1, 2]);
      this.currentIndex.set(0);
    }
  }

  updateCardsToShow() {
    const len = this.cards().length;
    const index = this.currentIndex() + 100000 * len;
    this.indexesToShow.set([
      this.cards().indexOf(this.cards()[index % len]),
      this.cards().indexOf(this.cards()[(index + 1) % len]),
      this.cards().indexOf(this.cards()[(index + 2) % len]),
    ]);
    this.activeIndexChanged.emit(this.cards().indexOf(this.cards()[index % len]));
  }

  generateStates(index: number): string {
    if (this.isCollapsed()) {
      return this.indexesToShow().indexOf(index) !== -1 ? 'collapsed-' + this.indexesToShow().indexOf(index) : 'void';
    }
    return String(this.indexesToShow().indexOf(index) !== -1 ? this.indexesToShow().indexOf(index) : 'void');
  }

  isFirstInCollapsed(index: number): boolean {
    return this.isCollapsed() && this.indexesToShow().indexOf(index) === 0;
  }

  handleSwipingHorizontally(event: boolean): void {
    this.isSwipingHorizontally = event;
  }

  handleSwiping(event: SwipingEventModel): void {
    if (this.disableVerticalScroll()) {
      return;
    }
    const stepAmount = 30;
    const newMoveDelta = event.deltaY - this.movedBySwipe * stepAmount;
    const rotationDegree = Number((newMoveDelta * 0.4).toFixed(2));

    if (!this.isSwipingHorizontally) {
      // Apply transformation to each card element
      this.isSwiping = true;
      this.rotateFirstCard(rotationDegree);

      // Update index when the swipe distance exceeds the stepAmount
      if ((newMoveDelta > stepAmount || newMoveDelta < -1 * stepAmount) && !this.isAnimating) {
        this.isMovedBySwipe = true;
        this.movedBySwipe =
          newMoveDelta > 0
            ? this.movedBySwipe + Math.floor(newMoveDelta / stepAmount)
            : this.movedBySwipe - Math.floor((-1 * newMoveDelta) / stepAmount);
        this.currentIndex.update((v) => (newMoveDelta > 0 ? v + 1 : v - 1));
        this.updateCardsToShow();
      }
    }
  }

  next() {
    this.isSwiping = false;
    this.movedBySwipe = 0;
    if (this.isMovedBySwipe) {
      this.isMovedBySwipe = false;
      return;
    }
    this.currentIndex.update((v) => v + 1);
    this.updateCardsToShow();
  }

  prev() {
    this.isSwiping = false;
    this.movedBySwipe = 0;
    if (this.isMovedBySwipe) {
      this.isMovedBySwipe = false;
      return;
    }
    this.currentIndex.update((v) => v - 1);
    this.updateCardsToShow();
  }

  handleSwipeEnd(event: SwipePointEventModel): void {
    this.rotateFirstCard(0);
  }

  rotateFirstCard(degree: number): void {
    this.isSwiping = false;
    this.cardItems()[this.indexesToShow()[0]].nativeElement.style.transform = `translate(-50%, -50%) rotate(${-degree}deg)`;
    this.cdr.markForCheck();
  }

  onClick(index: number, forceToRun = false) {
    if ((this.isAnimating || this.isSwiping) && !forceToRun) {
      return;
    }
    const newIndex = this.indexesToShow().indexOf(index);
    if (newIndex === 0) {
      this.cardClicked.emit();
    } else if (newIndex === 2) {
      this.currentIndex.set(this.currentIndex() + 1);
      this.updateCardsToShow();
      setTimeout(() => {
        this.onClick(newIndex, true);
      }, 400);
    } else {
      this.currentIndex.set(this.currentIndex() + 1);
      this.updateCardsToShow();
    }
  }

  handleAnimationRunning(isRunning: boolean) {
    if (this.isDestroyed) return;
    this.isAnimating = isRunning;
    if (this.isAnimationRunning) {
      this.isAnimationRunning.emit(isRunning);
    }
  }

  removeSpace(val: string): string {
    return val.replace(/\s/g, '');
  }

  formatExpirationDate(expirationDate: string): string {
    if (expirationDate.includes('/')) {
      return expirationDate;
    }
    if (expirationDate.length === 4) {
      return expirationDate.slice(0, 2) + '/' + expirationDate.slice(2);
    }
    return expirationDate;
  }

  removeRialAndComma(val: string): string {
    return convertNonEnglishDigits(val).replace(/\D/g, '');
  }

  generateBnplTitle(installmentCount: number): string {
    if (installmentCount === 1) {
      return 'اعتبار ماهانه';
    } else {
      return `اعتبار ${installmentCount + 1} قسطه`;
    }
  }

  getDpCardBadge(status?: CardStatus): { status: NgxBadgeStatus; label: string } | null {
    if (status === undefined) return null;
    const map: Partial<Record<CardStatus, { status: 'neutral' | 'error' | 'warning'; label: string }>> = {
      [CardStatus.ISSUED]: { status: 'neutral', label: 'نیاز به فعال‌سازی' },
      [CardStatus.INACTIVE]: { status: 'error', label: 'مسدود شده' },
      [CardStatus.HOT]: { status: 'error', label: 'مسدود شده' },
      [CardStatus.EXPIRED]: { status: 'warning', label: 'منقضی شده' },
    };

    return map[status] ?? null;
  }

  protected readonly toPersianChar = toPersianChar;
  protected readonly AccountStatus = AccountStatus;
  protected readonly CardStatus = CardStatus;
  protected readonly cardIcons = cardIcons;
}
