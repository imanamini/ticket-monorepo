import { Component, Input, TemplateRef } from '@angular/core';
import { ApiFile } from '../../../../api/clients/models/common/api-file';
import { FeatureCards } from '../../../../api/clients/models/templates/ipg/feature-cards';
import { ImageSliderVerticalComponent } from '../../ui-image-slider/image-slider-vertical/image-slider-vertical.component';
import { NgClass, NgTemplateOutlet, NgIf, NgOptimizedImage, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-introduction-default',
  templateUrl: './ui-introduction-default.component.html',
  styleUrls: ['./ui-introduction-default.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, NgIf, NgOptimizedImage, ImageSliderVerticalComponent, NgFor],
})
export class UiIntroductionDefaultComponent {
  @Input()
  introductionType = 'default';

  @Input()
  title = '';

  @Input()
  primarySubtitle = '';

  @Input()
  secondarySubtitle = '';

  @Input()
  ctaText = '';

  @Input()
  heroImage: ApiFile | undefined;

  @Input()
  isVideo = false;

  @Input()
  features: FeatureCards[] | undefined;

  @Input()
  buttons!: TemplateRef<any>;

  @Input()
  titleTemplate!: TemplateRef<any>;

  @Input()
  sliderImages: any | null = null;
}
