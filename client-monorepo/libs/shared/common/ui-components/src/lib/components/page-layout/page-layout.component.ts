import { Component, computed, ElementRef, inject, input, OnDestroy, output, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmitterService, EmittingDataEnum, LayoutService } from '@client-monorepo/common/utilities';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { Subscription } from 'rxjs';
import { BackHandlerService } from '@client-monorepo/back-handler';
import { NgxAppBarButtonType, NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { TimerCountDownModel } from '@digipay/ngx-count-down';
import { ButtonSize } from '@digipay/ngx-button/lib/data-access/button-size';
import { DigikalaScrollTrackerDirective } from '@client-monorepo/pillar/digikala';

export type TitleBarActionImage =
  | 'qr-scan'
  | 'play'
  | 'info-circle'
  | 'headphone'
  | 'checklist'
  | 'edit-square'
  | 'download'
  | 'bag'
  | 'search'
  | 'check-square'
  | '';

@Component({
  selector: 'common-ui-components-page-layout',
  standalone: true,
  imports: [CommonModule, NgxAppBarComponent, DigikalaScrollTrackerDirective],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
})
export class PageLayoutComponent implements OnDestroy {
  private emitterService = inject(EmitterService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  private backHandler = inject(BackHandlerService);
  private layoutService = inject(LayoutService);

  // Inputs
  title = input<string>();
  stickyHeader = input<boolean>(true);
  showBorder = input<boolean>(true);
  showBackIcon = input<boolean>(true);
  hasBackAction = input<boolean>(true);
  headerClasses = input<string>('surface-elevated');
  bodyClasses = input<string>('surface-elevated');
  layoutClasses = input<string>('');
  infoButton = input<boolean>();
  infoStyle = input<'link' | 'default'>('link');
  actionImage = input<TitleBarActionImage>();
  actionSize = input<ButtonSize>('medium');
  actionText = input<string | null | boolean>();
  actionTextMode = input<'info' | 'error'>('info');
  leftButtonDisabled = input<boolean>(false);
  leftIcon = input<string>('');
  leftTimer = input<TimerCountDownModel | undefined>();
  closeButton = input<boolean>();

  // Outputs
  onBackAction = output<void>();
  onCustomAction = output<void>();
  infoClick = output<void>();
  onTextClick = output<void>();
  onLeftIconClick = output<void>();
  onFinishRightTimer = output<void>();
  onFinishLeftTimer = output<void>();

  // View Child
  pageBody = viewChild<ElementRef>('pageBody');

  // Component state
  emitted = false;
  private routerSubscription?: Subscription;
  private scrollCheckTimeout?: any;

  // Computed properties
  bodyStyle = computed(() => {
    const padding = !this.layoutService.hasScrolled() ? this.bottomNavigationService.reservedHeight() : 0;
    return { paddingBottom: `${padding}px` };
  });

  rightButton = computed(() => {
    const button: NgxAppBarButtonType = {};

    if (this.showBackIcon()) {
      button.icon = 'arrow-right';
    }

    if (this.closeButton()) {
      button.icon = 'close';
    }

    button.size = 'medium';
    button.mode = 'icon-only';
    button.style = 'neutral-link';

    return button.icon || button.label ? button : undefined;
  });

  leftButton = computed(() => {
    const button: NgxAppBarButtonType = {};

    if (this.infoButton()) {
      button.icon = 'info-circle';
    } else if (this.actionImage() && this.actionImage() !== '') {
      button.icon = this.actionImage();
    }

    if (this.actionText()) {
      button.label = this.actionText()?.toString();
    } else {
      button.mode = 'icon-only';
    }

    button.size = this.actionSize();

    if (this.actionTextMode() === 'error') {
      button.destructive = true;
      button.style = 'link';
    } else if (this.actionTextMode() === 'info') {
      if (this.infoStyle() === 'link') {
        button.style = 'link';
      }
    }

    if (this.leftButtonDisabled()) {
      button.disabled = true;
    }

    if (this.leftTimer()) {
      button.timer = this.leftTimer();
    }

    return button.icon || button.label ? button : null;
  });

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    if (this.scrollCheckTimeout) {
      clearTimeout(this.scrollCheckTimeout);
    }
  }

  onLeftButtonClick(event: any): void {
    if (this.infoButton()) {
      this.infoClick.emit(event);
    }

    if (this.actionText()) {
      this.onTextClick.emit(event);
    }
  }

  onLeftIcon(event: any): void {
    this.onLeftIconClick.emit(event);
  }

  handleActionClick(): void {
    if (this.hasBackAction()) {
      this.backHandler.goBack();
    }
    this.onBackAction.emit();
  }

  handleScroll(event: any): void {
    if (this.pageBody()?.nativeElement === event.currentTarget) {
      const element = this.pageBody()?.nativeElement;
      const scrollPosition = element.scrollTop + element.offsetHeight;
      const maxScroll = element.scrollHeight;

      if (scrollPosition >= maxScroll - 50) {
        if (!this.emitted) {
          this.emitterService.emitEvent(EmittingDataEnum.PAGE_LAYOUT_SCROLLED_TO_END);
          this.emitted = true;
        }
      } else {
        this.emitted = false;
      }
    }
  }
}
