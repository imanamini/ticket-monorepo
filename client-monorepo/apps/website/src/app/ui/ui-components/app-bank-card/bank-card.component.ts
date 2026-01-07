import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { convertStoredCardToCardProfile, getReformPan } from '../../../utils/card-helpers';
import { isEqual } from 'lodash';
import { MemoryCacheService } from '@digipay/ng-lib-memory-cache';
import { CardProfile } from '../../../core/models/card/card-profile-response.model';
import { StoredCard } from '../../../core/models/card/stored-card.model';
import { ColorService } from '../bank-card/services/color.service';
import { ImageApiService } from '../../../api/digipay/image-api.service';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgClass, NgStyle, NgIf, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, ApiImageModule],
})
export class BankCardComponent implements OnInit, OnChanges {
  @Input()
  cardProfile: CardProfile;

  @Input()
  storedCard: StoredCard;

  @Input()
  transferLayout = false;

  @Input()
  transferType = 'in';

  @Input()
  style = {};

  @Input()
  moreButton = false;

  @Output()
  moreButtonClick = new EventEmitter<StoredCard>();

  @Output()
  cardClicked = new EventEmitter<StoredCard>();

  @Input()
  isPinned = false;

  background: SafeStyle;

  panParts: Array<string> = [];

  @Input()
  showExpireDate = true;

  @Input()
  disableBank = false;

  constructor(
    private colorService: ColorService,
    private sanitizer: DomSanitizer,
    private cache: MemoryCacheService,
    private imageApiService: ImageApiService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
    this.imageApiService.api = 'digipay';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.storedCard &&
      changes.storedCard.currentValue &&
      isEqual(changes.storedCard.currentValue, changes.storedCard.previousValue)
    ) {
      this.cardProfile = convertStoredCardToCardProfile(changes.storedCard.currentValue);
      this.cardProfile.pan = getReformPan(this.getPan(this.cardProfile.pan));
    }
    if (changes.cardProfile && changes.cardProfile.currentValue) {
      this.makeBackground();
      this.cardProfile.pan = getReformPan(this.getPan(this.cardProfile.pan));
    }
  }

  ngOnInit() {
    if (this.storedCard) {
      this.cardProfile = convertStoredCardToCardProfile(this.storedCard);
      this.cardProfile.pan = getReformPan(this.getPan(this.cardProfile.pan));
    }
    if (this.cardProfile.patternImageId) {
      this.makeBackground();
    }
  }

  onCardClick($event): void {
    if (!$event.target.classList.contains('more-button')) {
      this.cardClicked.emit(this.storedCard);
    }
  }

  moreIconClick() {
    this.moreButtonClick.emit(this.storedCard);
  }

  getPan(pan: string) {
    return pan.replace(/\s+/g, '');
  }

  private setBackground(color: number, url: string = null) {
    const rgbColor = ColorService.convertDecimalToRgb(color);
    this.background = this.sanitizer.bypassSecurityTrustStyle(rgbColor + (url ? ' url(' + url + ')' : '') + ' no-repeat 0 0/100% 100%');
    return this.background;
  }

  private makeBackground(): void {
    const c1 = this.getCardColor();
    const bgImage = this.cardProfile.patternImageId || this.cardProfile.imageId;
    if (bgImage) {
      this.getBackgroundResourceUrl(bgImage).then((resourceUrl) => {
        this.setBackground(c1, resourceUrl);
      });
    } else {
      this.setBackground(c1);
    }
    this.setBackground(c1);
  }

  private getCardColor(): number {
    return this.cardProfile.colorRange && this.cardProfile.colorRange.length > 0 ? this.cardProfile.colorRange[0] : 0;
  }

  private getBackgroundResourceUrl(imageId: string): Promise<string> {
    return new Promise((resolve) => {
      const CACHE_KEY = 'image_' + imageId;
      if (this.cache.has(CACHE_KEY)) {
        resolve(this.cache.get(CACHE_KEY));
        return;
      }
      this.imageApiService.getImage(imageId).subscribe((data) => {
        const blob = new Blob([data as Blob], {
          type: 'application/octet-stream',
        });
        if (isPlatformBrowser(this.platformId)) {
          const resourceUrl = window.URL.createObjectURL(blob);
          this.cache.put(CACHE_KEY, resourceUrl);
          resolve(resourceUrl);
        }
      });
    });
  }
}
