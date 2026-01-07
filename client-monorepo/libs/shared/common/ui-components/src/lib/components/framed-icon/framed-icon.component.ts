import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ServiceImagesType } from '@client-monorepo/common/service-data';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { StatusLightDirective } from '../status-light/status-light.directive';
import { StatusLightSizesEnum } from '../../data-access/constants/status-light-sizes.enum';
import { StatusLightBordersEnum } from '../../data-access/constants/status-light-boders.enum';
import { StatusLightColorsEnum } from '../../data-access/constants/status-light-colors.enum';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { FramedIconGradientModel } from '../../data-access/models/framed-icon-gradient.model';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { AppServiceBadge, SERVICE_BADGE_MODE_MAPPER, SERVICE_BADGE_STATUS_MAPPER } from '@client-monorepo/common/service-data';

@Component({
  selector: 'common-ui-components-framed-icon',
  standalone: true,
  imports: [
    CommonModule,
    DpIconComponent,
    ApiImageModule,
    StatusLightDirective,
    NgOptimizedImage,
    PipesModule,
    NgxTrackableIdDirective,
    NgxBadgeModule,
  ],
  templateUrl: './framed-icon.component.html',
  styleUrl: './framed-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FramedIconComponent {
  // Inputs
  type = input<ServiceImagesType>(ServiceImagesType.ICON);
  size = input<'XS' | 'SMALL' | 'MEDIUM' | 'LARGE' | 56 | 64 | 40>('MEDIUM');
  icon = input<string>('');
  iconType = input<'linear' | 'bold' | 'due'>('linear');
  enableGradient = input<boolean>(false);
  iconStyle = input<string>('');
  iconColor = input<string>(''); // Set a single color for the icon if a gradient isn't needed (e.g., based on type)
  showText = input<boolean>(false);
  text = input<string>('');
  maxTextLength = input<number | undefined>(undefined);
  bg = input<'surface-back' | 'surface-elevated' | 'surface-glass-onelevated'>('surface-back');
  border = input<string>(''); // e.g., 'border-100 border-color-air'
  showBadge = input<boolean>(false);
  badge = input<AppServiceBadge>();
  showStatusLight = input<boolean>(false);
  statusLightSize = input<StatusLightSizesEnum>();
  statusLightColor = input<StatusLightColorsEnum>();
  statusLightBorderColor = input<StatusLightBordersEnum>();
  enableMixedBlendMode = input<boolean>(false);
  trackerIdPrefix = input<string>('');
  gradientConfig = input<FramedIconGradientModel>({} as FramedIconGradientModel);
  serviceMode = input(false);
  innerBoxStyle = computed(() => {
    // For Gradient
    const config = this.gradientConfig();
    return {
      background: this.enableGradient()
        ? `linear-gradient(${config.degree}deg, ${config.start.color} ${config.start.point}%, ${config.end.color} ${config.end.point}%)`
        : '',
    };
  });

  // Variables
  readonly ServiceImagesType = ServiceImagesType;
  sizeToStylesMapper = {
    XS: { iconWrapperClasses: 'p-medium radius-small size-40', wrapperClasses: 'gap-low', iconSize: '24', textClasses: 'l-2' },
    40: { iconWrapperClasses: 'p-small radius-small size-40', wrapperClasses: 'gap-low', iconSize: '24', textClasses: 'l-2' },
    SMALL: { iconWrapperClasses: 'p-medium radius-minus size-48', wrapperClasses: 'gap-low', iconSize: '32', textClasses: 'l-2' },
    MEDIUM: { iconWrapperClasses: 'p-plus radius-medium size-52', wrapperClasses: 'gap-low', iconSize: '32', textClasses: 'l-2' },
    56: { iconWrapperClasses: 'p-minus radius-minus size-56', wrapperClasses: 'gap-low', iconSize: '32', textClasses: 'l-1' },
    64: { iconWrapperClasses: 'p-minus radius-minus size-64', wrapperClasses: 'gap-small', iconSize: '40', textClasses: 'c-1' },
    LARGE: { iconWrapperClasses: 'p-huge radius-plus size-72', wrapperClasses: 'gap-small', iconSize: '40', textClasses: 'c-3' },
  };
  generatedStyles = computed(() => this.sizeToStylesMapper[this.size()]);
  protected readonly SERVICE_BADGE_MODE_MAPPER = SERVICE_BADGE_MODE_MAPPER;
  protected readonly SERVICE_BADGE_STATUS_MAPPER = SERVICE_BADGE_STATUS_MAPPER;
}
