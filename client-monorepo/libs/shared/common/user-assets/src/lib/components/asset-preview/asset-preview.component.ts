import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { Action, ActionHandlerService } from '@client-monorepo/common/action-handler';
import { AssetTypes, UserAssetTypesEnum, UserAssetTypesMapper } from '../../data-access/consts/user-assets.const';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'common-user-assets-asset-preview',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxSkeletonLoadingComponent, PipesModule, NgxTrackableIdDirective, NgxBadgeModule, NgxIcon],
  templateUrl: './asset-preview.component.html',
  styleUrl: './asset-preview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPreviewComponent {
  classes = input<string>('');
  isLoading = input<boolean>(false);
  title = input.required<string>();
  icon = input.required<string>();
  subTitle = input.required<string>();
  primaryColor = input.required<string>();
  secondaryColor = input.required<string>();
  subTitleType = input<'text' | 'price' | 'cta'>('text');
  unit = input<'' | 'ریال' | 'ت'>('');
  isDisabled = input<boolean>(false);
  patternColor = input<'blue' | 'gold' | 'silver' | 'bronze' | 'purple' | 'diamond' | 'brilliance' | 'titanium'>('blue');
  iconBoxStyle = computed(() => {
    return {
      background: `linear-gradient(224deg, ${this.primaryColor()} 11.43%, ${this.secondaryColor()} 92.87%)`,
    };
  });
  clicked = output<void>();
  doDefaultAction = input<boolean>(true);
  action = input<Action>();
  actionHandlerService = inject(ActionHandlerService);
  reverseUserAssetTypesMapper: Record<string, UserAssetTypesEnum> = Object.fromEntries(
    Object.entries(UserAssetTypesMapper).map(([key, value]) => [value, key as UserAssetTypesEnum]),
  );

  onClick(): void {
    if (this.doDefaultAction() && this.action()) {
      this.actionHandlerService.handle(this.action()!);
    }
    this.clicked.emit();
  }

  protected readonly AssetTypes = AssetTypes;
}
