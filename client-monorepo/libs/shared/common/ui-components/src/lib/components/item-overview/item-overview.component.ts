import { ChangeDetectionStrategy, Component, inject, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { CategoryImageComponent } from '../category-image/category-image.component';
import { FramedIconComponent } from '../framed-icon/framed-icon.component';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { ItemOverview } from '../../data-access/models/selected-section.type';
import { Action, ActionHandlerService } from '@client-monorepo/common/action-handler';
import { RateCountComponent } from '@client-monorepo/common/rate';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxRadioButtonComponent } from '@digipay/ngx-radio-button';

@Component({
  selector: 'common-ui-components-item-overview',
  standalone: true,
  imports: [
    CommonModule,
    ApiImageModule,
    NgxBadgeModule,
    NgxSkeletonLoadingComponent,
    FramedIconComponent,
    CategoryImageComponent,
    RateCountComponent,
    DpIconComponent,
    NgxIcon,
    NgxRadioButtonComponent,
  ],
  templateUrl: './item-overview.component.html',
  styleUrl: './item-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemOverviewComponent {
  item = input<ItemOverview>({} as ItemOverview);
  mixedBlendModeEnabled = input<boolean>(false);
  imageMode = input<'category-image' | 'framed-icon'>('framed-icon');
  doDefaultAction = input<boolean>(true);
  enableSingleLineMode = input<boolean>(false);
  hideSubtitleBold = input<boolean>(false);
  hideButton = input<boolean>(false);
  disableTopPadding = input<boolean>(false);
  showRadioButton = input<boolean>(false);
  enableImageGradient = input<boolean>(true);
  radioChecked = model<boolean>(false);
  clicked = output<ItemOverview>();
  actionHandlerService = inject(ActionHandlerService);

  handleClick(): void {
    if (this.item() !== undefined) {
      if (this.doDefaultAction() && this.item()?.action) {
        this.actionHandlerService.handle(this.item()?.action as Action).then();
      }
      this.clicked.emit(this.item() as ItemOverview);
    }
  }
}
