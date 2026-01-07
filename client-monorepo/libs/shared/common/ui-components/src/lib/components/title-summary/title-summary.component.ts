import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { PerformanceTierService, randomNumber } from '@client-monorepo/common/utilities';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { IconMode } from '@client-monorepo/common/icon';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxDividerComponent } from '@digipay/ngx-divider';

@Component({
  selector: 'common-ui-components-title-summary',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoadingComponent, NgxTrackableIdDirective, NgxButtonComponent, NgxIcon, NgxDividerComponent],
  templateUrl: './title-summary.component.html',
  styleUrl: './title-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleSummaryComponent {
  // Inputs
  buttonTrackerId = input<string>('');
  title = input.required<string>();
  mode = input<'PAGE_TITLE' | 'SECTION_TITLE' | 'SUBTITLE'>('SECTION_TITLE');
  description = input('');
  rightIcon = input<IconMode | undefined>(undefined);
  showButton = input(true);
  buttonTitle = input('مشاهده همه');
  buttonIcon = input<string | undefined>();
  navigationLink = input<string>();
  navigationParams = input<{ [key: string]: string }>({});
  isLoading = input(false);
  buttonIconReversed = input(false);
  mustReturnAction = input(false);
  wrapperId = input<string>('title_' + Date.now() + '_' + Math.floor(randomNumber(100, 999)));
  wrapperClasses = input<string>('');
  hasDivider = input(false);

  // Outputs
  onButtonClicked = output<void>();

  // Injections
  router = inject(Router);

  // Variables
  stylesMapper = {
    PAGE_TITLE: { wrapper: 'py-micro', title: 'st-6', description: 'c-3', height: '36px', align: 'align-items-center' },
    SECTION_TITLE: { wrapper: 'py-tiny', title: 'st-8', description: 'c-3', height: '32px', align: '' },
    SUBTITLE: { wrapper: 'py-low', title: 'c-1', description: 'c-3', height: '32px', align: '' },
  };

  performanceTierService = inject(PerformanceTierService);
  loadingEffect = computed(() => this.performanceTierService.tier() !== 'low');

  handleAction(): void {
    if (this.mustReturnAction()) {
      this.onButtonClicked.emit();
    } else {
      this.router.navigate([this.navigationLink()], { queryParams: this.navigationParams() });
    }
  }
}
