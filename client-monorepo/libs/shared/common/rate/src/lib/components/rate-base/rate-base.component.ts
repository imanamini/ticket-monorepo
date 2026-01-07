import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RateTitleComponent } from '../rate-title/rate-title.component';
import { DeliveryFeedbackComponent } from '../delivery-feedback/delivery-feedback.component';
import { DeliveryFeedBacks, NOT_DELIVERED_CHIPS, DELIVERED_CHIPS } from '../../data-access/constants/rate-const';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { FeedbackInputComponent } from '../feedback-input/feedback-input.component';
import { RateBadgesComponent } from '../rate-badges/rate-badges.component';
import { RateBadgeModel } from '../../data-access/models/rate-badge.model';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { RateService } from '../../data-access/services/rate.service';
import { RateBody } from '../../data-access/models/rate-body.model';
import { Subscription } from 'rxjs';
import { RateApiService } from '../../data-access/services/rate-api.service';
import { MessageService } from '@client-monorepo/common/utilities';
export enum PaymentChannels {
  API = 0,
  UPG = 1,
  SMART_POS = 2,
  QR = 3,
  ESCROW = 4,
  BARCODE = 5,
  LINUX_POS = 6,
  APP = 7,
}

export enum PurchaseModes {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

@Component({
  selector: 'common-rate-rate-base',
  standalone: true,
  imports: [
    CommonModule,
    RateTitleComponent,
    DeliveryFeedbackComponent,
    StarRatingComponent,
    FeedbackInputComponent,
    RateBadgesComponent,
    NgxButtonComponent,
  ],
  templateUrl: './rate-base.component.html',
  styleUrl: './rate-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateBaseComponent implements OnInit {
  // Injections
  bottomSheetService = inject(NgxBottomSheetService);
  rateService = inject(RateService);
  rateApi = inject(RateApiService);
  messageService = inject(MessageService);

  // Variables
  subs = new Subscription();
  storeImage = signal<string | undefined>(undefined);
  title = signal<string | undefined>(undefined);
  purchaseType = signal<PurchaseModes>(PurchaseModes.ONLINE);
  feedBackInputTitle = signal<string>('');
  feedBackInputChips = signal<string[]>([]);
  feedBackSelectedChips = signal<string[]>([]);
  feedbackInputSelectionLimit = signal<number>(0);
  showFeedbackInputComment = signal<boolean>(false);
  deliveryFeedBack = signal<DeliveryFeedBacks | undefined>(undefined);
  rateStarsCount = signal<number>(0);
  rateBadges = signal<RateBadgeModel | undefined>(undefined);
  feedbackComment = '';

  // Computed
  showDeliveryFeedback = computed(() => {
    if (this.purchaseType() === PurchaseModes.OFFLINE) {
      return false;
    } else {
      return (
        !this.deliveryFeedBack() ||
        (this.deliveryFeedBack() === DeliveryFeedBacks.DELIVERED && !this.rateStarsCount()) ||
        this.deliveryFeedBack() === DeliveryFeedBacks.NOT_DELIVERED
      );
    }
  });
  showStarRating = computed(() => {
    return (
      (this.purchaseType() === PurchaseModes.ONLINE && this.deliveryFeedBack() === DeliveryFeedBacks.DELIVERED) ||
      this.purchaseType() === PurchaseModes.OFFLINE
    );
  });
  showFeedbackInput = computed(() => {
    if (this.purchaseType() === PurchaseModes.ONLINE) {
      return (
        this.deliveryFeedBack() === DeliveryFeedBacks.NOT_DELIVERED ||
        (this.deliveryFeedBack() === DeliveryFeedBacks.DELIVERED && this.rateStarsCount() && this.rateStarsCount() < 4)
      );
    } else {
      return this.rateStarsCount() && this.rateStarsCount() < 4;
    }
  });
  showRateBadges = computed(() => {
    if (this.purchaseType() === PurchaseModes.ONLINE) {
      return !!(this.rateStarsCount() && this.rateStarsCount() > 3 && this.deliveryFeedBack() === DeliveryFeedBacks.DELIVERED);
    } else {
      return !!(this.rateStarsCount() && this.rateStarsCount() > 3);
    }
  });
  submitDisabled = computed(() => {
    if (this.purchaseType() === PurchaseModes.ONLINE) {
      if (!this.deliveryFeedBack()) return true;
      if (this.deliveryFeedBack() === DeliveryFeedBacks.DELIVERED && this.rateStarsCount() > 3) {
        return false;
      }
      return this.feedBackSelectedChips().length === 0;
    } else {
      if (this.rateStarsCount() > 0) {
        return false;
      }
      return this.feedBackSelectedChips().length === 0;
    }
  });

  ngOnInit(): void {
    this.getBottomSheetData();
  }

  getBottomSheetData(): void {
    const data = this.bottomSheetService.data();
    this.storeImage.set(data.storeImage ?? '');
    this.title.set(data.title ?? '');
    this.purchaseType.set(this.checkPurchaseType(data.gateway));
  }

  checkPurchaseType(channel: PaymentChannels): PurchaseModes {
    if (
      channel === PaymentChannels.LINUX_POS ||
      channel === PaymentChannels.SMART_POS ||
      channel === PaymentChannels.QR ||
      channel === PaymentChannels.BARCODE
    ) {
      return PurchaseModes.OFFLINE;
    } else {
      return PurchaseModes.ONLINE;
    }
  }

  handleDeliveryFeedbackSubmit(feedback: DeliveryFeedBacks): void {
    this.resetEverything();
    const isDelivered = feedback === DeliveryFeedBacks.DELIVERED;
    this.feedBackInputTitle.set(isDelivered ? 'دلایل نارضایتی خود را انتخاب کنید. (تا سه مورد)' : 'به چه دلیلی دریافت نکردید؟');
    this.feedBackInputChips.set(isDelivered ? Object.values(DELIVERED_CHIPS) : Object.values(NOT_DELIVERED_CHIPS));
    this.feedbackInputSelectionLimit.set(isDelivered ? 3 : 1);
    this.showFeedbackInputComment.set(isDelivered);
    this.deliveryFeedBack.set(feedback);
  }

  resetEverything(): void {
    this.rateStarsCount.set(0);
    this.feedBackSelectedChips.set([]);
    this.rateBadges.set(undefined);
  }

  handleStarsSelected(numberOfStars: number): void {
    this.rateBadges.set(undefined);
    if (this.purchaseType() === PurchaseModes.OFFLINE) {
      this.resetEverything();
      this.feedBackInputTitle.set('دلایل نارضایتی خود را انتخاب کنید. (تا سه مورد)');
      this.feedBackInputChips.set(Object.values(DELIVERED_CHIPS));
      this.feedbackInputSelectionLimit.set(3);
      this.showFeedbackInputComment.set(true);
    }
    this.rateStarsCount.set(numberOfStars);
  }

  handleFeedbackChipSelected(chips: string[]): void {
    this.feedBackSelectedChips.set(chips);
  }

  handleFeedbackCommentAdded(comment: string): void {
    this.feedbackComment = comment;
  }

  handleBadgeSelect(badges: RateBadgeModel | undefined): void {
    this.rateBadges.set(badges);
  }

  handleSubmitBtn(): void {
    const rateId = this.rateService.getCurrentRatable()?.uid;
    if (!rateId) {
      return;
    }
    if (this.deliveryFeedBack() === DeliveryFeedBacks.NOT_DELIVERED) {
      if (!this.feedBackSelectedChips().length) {
        return;
      }
      if (this.feedBackSelectedChips()[0] === NOT_DELIVERED_CHIPS.CANCEL_ORDER) {
        this.ignoreRate(rateId);
      } else {
        this.postponeRate(rateId);
      }
    } else {
      this.submitRate(rateId);
    }
  }

  postponeRate(rateId: string): void {
    this.rateApi.postpone(rateId, this.createReasons()).subscribe({
      next: () => {
        this.showMessageAndClose('نظر شما با موفقیت ثبت شد.');
      },
      error: () => {
        this.messageService.showErrorMessage('خطا در برقراری ارتباط');
      },
    });
  }

  ignoreRate(rateId: string): void {
    this.rateApi.ignore(rateId, this.createReasons()).subscribe({
      next: () => {
        this.showMessageAndClose('نظر شما با موفقیت ثبت شد.');
      },
      error: () => {
        this.messageService.showErrorMessage('خطا در برقراری ارتباط');
      },
    });
  }

  submitRate(rateId: string): void {
    const body: RateBody = {
      uid: rateId,
      rate: {
        comment: this.feedbackComment,
        reasons: this.createReasons(),
        score: this.rateStarsCount(),
      },
    };
    this.rateApi.postRate(body).subscribe({
      next: () => {
        this.showMessageAndClose('نظر شما با موفقیت ثبت شد.');
      },
    });
  }

  showMessageAndClose(message: string): void {
    this.messageService.showSuccessMessage(message);
    this.resetEverything();
    this.bottomSheetService.outputData.set({
      sentRate: true,
    });
    this.bottomSheetService.closeBottomSheet();
  }

  createReasons(): string[] {
    const reasons: string[] = this.feedBackSelectedChips();
    if (this.deliveryFeedBack()) {
      reasons.push(this.deliveryFeedBack() === DeliveryFeedBacks.DELIVERED ? 'DELIVERED' : 'NOT_DELIVERED');
    }
    if (this.rateBadges()?.title) {
      reasons.push(this.rateBadges()!.title);
    }
    return reasons;
  }
}
