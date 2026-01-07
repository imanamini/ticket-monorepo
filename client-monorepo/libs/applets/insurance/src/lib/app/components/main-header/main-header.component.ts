import { Component, inject, input, output } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { FaqService } from '../../data-access/services/faq.service';
import { FaqCategoryTypeEnum } from '../../data-access/enums/faq-category-type.enum';
import { IconEnum } from '../../data-access/enums/icon.enum';
import { CloseService } from '../../features/vehicle/data-access/services/shared/close.service';
import { DpxService } from '../../data-access/services/dpx.service';
import { Router } from '@angular/router';

@Component({
  selector: 'main-header',
  standalone: true,
  imports: [
    NgxIcon
  ],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.scss'
})
export class MainHeaderComponent {
  rightIconClicked = output<void>();

  isCloseMode = input<boolean>(false, {alias: 'is-close-mode'});
  hideCloseIcon = input<boolean>(false, {alias: 'hide-icon-right'});
  title = input<string>();
  leftIconName = input<string>();
  leftIconType = input<string>();
  faqCategory = input<FaqCategoryTypeEnum>(FaqCategoryTypeEnum.THIRD_PARTY_VEHICLE);
  leftIconClicked = output<void>();
  protected readonly IconEnum = IconEnum;

  private readonly faqService = inject(FaqService);
  private readonly closeService = inject(CloseService);
  private readonly dpxService = inject(DpxService);
  private readonly route = inject(Router);

  handleFaq(): void {
    this.faqService.open(this.faqCategory());
  }

  onClose(): void {
    if (this.dpxService.IsEnteredFromDpx) {
      this.closeService.close();
    } else {
      this.route.navigate(['/']);
    }
    this.rightIconClicked.emit();
  }
}
