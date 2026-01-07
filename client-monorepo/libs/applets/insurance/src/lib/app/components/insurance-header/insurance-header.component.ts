import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { NgClass } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';

import { HeaderTitlePositionEnum } from '../../data-access/enums/header-title-position.enum';
import { HeaderIconModel } from '../../data-access/models/header-icon.model';
import { FaqService } from '../../data-access/services/faq.service';
import { IconEnum } from '../../data-access/enums/icon.enum';
import { FaqCategoryTypeEnum } from '../../data-access/enums/faq-category-type.enum';

@Component({
  selector: 'insurance-header',
  standalone: true,
  imports: [
    NgClass,
    NgxIcon,
    NgxSkeletonLoadingComponent
  ],
  templateUrl: './insurance-header.component.html',
  styleUrl: './insurance-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceHeaderComponent {

  private faqService = inject(FaqService);

  title = input<string>('بیمه شخص ثالث');
  closeIconName = input<IconEnum>(IconEnum.Close);
  showCloseIcon = input<boolean>(true);
  showSupport = input<boolean>(true);
  leftIcons = input<HeaderIconModel[]>([]);
  rightIcons = input<HeaderIconModel[]>([]);
  titlePosition = input<HeaderTitlePositionEnum>(HeaderTitlePositionEnum.Right);
  closeIconClicked = output<Event>();
  faqCategory = input<FaqCategoryTypeEnum>(FaqCategoryTypeEnum.THIRD_PARTY_VEHICLE);

  protected readonly IconEnum = IconEnum;
  protected readonly HeaderTitlePositionEnum = HeaderTitlePositionEnum;

  constructor() {
  }

  handleCloseClicked(e: Event): void {
    this.closeIconClicked.emit(e);
  }

  handleFAQClicked(): void {
    this.faqService.open(this.faqCategory());
  }
}
