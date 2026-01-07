import { ButtonIcon } from '@digipay/ngx-button';
import { ActivatedRoute, Router } from '@angular/router';
import { HOME_ROUTE } from '../../../../data-access/constants/app-routes';
import { WealthNavigationService } from '@client-monorepo/wealth/navigation';
import { NgxAppBarButtonType, NgxAppBarComponent } from '@digipay/ngx-app-bar';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';

@Component({
  selector: 'wealth-applet-app-bar-wrapper',
  standalone: true,
  imports: [NgxAppBarComponent],
  templateUrl: './app-bar-wrapper.component.html',
  styleUrl: './app-bar-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppBarWrapperComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(WealthNavigationService);

  title = input.required<string>();
  leftButton = input<NgxAppBarButtonType>();
  leftIcon = input<string | ButtonIcon>();
  rightButton = input<NgxAppBarButtonType>({
    icon: 'arrow-right',
    style: 'neutral-link',
    mode: 'icon-only',
    size: 'medium',
  });

  onLeftIcon = output();
  onLeftButton = output();
  onBack = output();

  onLeftButtonClicked() {
    this.onLeftButton.emit();
  }

  onLeftIconClicked() {
    this.onLeftIcon.emit();
  }

  onBackClicked() {
    const query = this.activatedRoute.snapshot.queryParams;
    if (query['referrer'] === 'dpxapp') {
      this.router.navigateByUrl('/hub');
    } else if (query['referrer'] === 'wealth') {
      this.navigationService.navigate([HOME_ROUTE]);
    } else {
      this.onBack.emit();
    }
  }
}
