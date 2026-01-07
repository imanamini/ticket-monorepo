import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOverview, ServicesOrStoresSelectedComponent } from '@client-monorepo/common/ui-components';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { SectionBanner, SectionBannerSlide } from '@client-monorepo/common/utilities';

@Component({
  selector: 'common-app-banners-section-type-banner',
  standalone: true,
  imports: [CommonModule, ApiImageModule, ServicesOrStoresSelectedComponent],
  templateUrl: './section-type-banner.component.html',
  styleUrl: './section-type-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTypeBannerComponent {
  // Inputs
  bannerData = input.required<SectionBanner>();

  // Variables
  header = computed(() => {
    return {
      ...this.bannerData().extractedConfig,
      imageType: ServiceImagesType.IMAGE_ID,
    };
  });
  sections = computed(() => this.modifySections());

  modifySections(): ItemOverview[] {
    return (this.bannerData().slides as SectionBannerSlide[]).map((slide) => ({
      image: {
        type: ServiceImagesType.IMAGE_ID,
        name: slide.extractedData.image,
      },
      title: slide.extractedData.title,
      badge: slide.extractedData.badge?.text ? slide.extractedData?.badge : undefined,
      subTitleNormal: slide.extractedData.subTitleNormal,
      action: slide.extractedAction,
      divider: this.parseBoolean(slide.extractedData.divider),
    }));
  }
  private parseBoolean(value: string | boolean): boolean {
    return value === 'true' || value === true;
  }
}
