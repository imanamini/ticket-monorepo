import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { ChangeColorOpacity } from '@client-monorepo/common/utilities';
import { CardPreviewConfigInterface } from '../../data-access/models/card-preview-config.interface';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgxCard } from '@digipay/ngx-card';

@Component({
  selector: 'daily-bank-card-preview',
  standalone: true,
  imports: [CommonModule, ApiImageModule, PipesModule, NgxCard],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent {
  config = input<CardPreviewConfigInterface>();
  classes = computed<string>(() => {
    return this.config()?.classes ?? '';
  });
  bankName = computed<string>(() => {
    return this.config()?.bankName ?? '';
  });
  bankLogoId = computed<string>(() => {
    return this.config()?.bankLogoId ?? '';
  });
  cardNumber = computed<string>(() => {
    return this.config()?.cardNumber ?? '';
  });
  expDate = computed<string>(() => {
    return this.config()?.expDate ?? '';
  });
  ownerName = computed<string>(() => {
    return this.config()?.ownerName ?? '';
  });
  baseColor = computed<string>(() => {
    return this.config()?.baseColor ?? '#33312E';
  });
  isLoading = computed<boolean>(() => {
    return this.config()?.isLoading ?? false;
  });
  isDestination = computed<boolean | undefined>(() => {
    return this.config()?.isDestination ?? undefined;
  });
  isPinned = computed<boolean>(() => {
    return this.config()?.isPinned ?? false;
  });
  isMinimized = computed<boolean>(() => {
    return this.config()?.isMinimized ?? false;
  });
  isExpanded = computed<boolean>(() => {
    return this.config()?.isExpanded ?? false;
  });
  isSkeleton = computed<boolean>(() => {
    return this.config()?.isSkeleton ?? false;
  });
  width = computed<string>(() => {
    return this.config()?.width ?? '100%';
  });
  alias = computed<string | undefined>(() => {
    return this.config()?.alias;
  });
  maskCardNumber = computed<boolean>(() => {
    return this.config()?.maskCardNumber ?? true;
  });

  cardStyle = computed<{ [key: string]: string }>(() => {
    return {
      backgroundImage:
        !this.isLoading() && !this.isSkeleton()
          ? `linear-gradient(130deg, ${ChangeColorOpacity.addOpacity(this.baseColor(), 0.5)} 41.73%, ${ChangeColorOpacity.addOpacity(this.baseColor(), 0)} 143.93%)`
          : 'inherit',
    };
  });
}
