import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NgxDpCarouselComponent, NgxDpCarouselSlideDirective } from '@digipay/ngx-dp-carousel';
import { NgxButtonComponent } from '@digipay/ngx-button';
import {
  AuthDigikalaService,
  DigikalaAuthErrorService,
  DigikalaService,
  DigikalaStorageService,
  DigikalaSuperWebService,
} from '@client-monorepo/pillar/digikala';
import { Router } from '@angular/router';
import { NgxEventTrackerService } from '@digipay/ngx-event-tracker';
import { AppNameService } from '@client-monorepo/common/utilities';
import { ErrorStateComponent } from '@client-monorepo/applets/pillar/error-state';
import { EventManagementService } from '@client-monorepo/common/event-management';

@Component({
  selector: 'pillar-login-applet',
  standalone: true,
  imports: [NgxDpCarouselComponent, NgxDpCarouselSlideDirective, NgxButtonComponent, ErrorStateComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginMainAppletComponent implements OnInit {
  private digikalaService = inject(DigikalaService);
  private digikalaSuperWebService = inject(DigikalaSuperWebService);
  private authDigikalaService = inject(AuthDigikalaService);
  private storageService = inject(DigikalaStorageService);
  private authErrorService = inject(DigikalaAuthErrorService);
  private router = inject(Router);
  private eventService = inject(NgxEventTrackerService);
  private eventManagementService = inject(EventManagementService);
  private appNameService = inject(AppNameService);

  index = signal(0);
  hasPassword = signal(false);
  slides = signal([
    {
      id: 'shop',
      title: 'خرید اقساطی، به صرفه!',
      text: 'دریافت اعتبار خرید کالا ۱ و ۴ قسطه، \n' + 'بدون چک و ضامن',
      image: 'shop',
    },
    {
      id: 'wallet',
      title: 'مدیریت کیف پول',
      text: 'واریز و برداشت آنی و ساده\n' + 'امکان خرید راحت با کیف پول',
      image: 'wallet',
    },
    {
      id: 'wealth',
      title: 'سرمایه گذاری طلا',
      text: 'خرید اعتباری طلا، با اطمینان خاطر\n' + 'با قابلیت نقدشوندگی آنی',
      image: 'wealth',
    },
  ]);

  ngOnInit() {
    // Track login view event
    this.eventService.sendEvent({
      eventName: 'LogInView',
      eventData: {},
    });
    this.eventManagementService.triggerEvent({
      eventType: 'pageView',
      data: {
        url: '/login',
      },
    });

    // Check if there's a "has password" error from auth flow
    if (this.authErrorService.hasPasswordError()) {
      this.hasPassword.set(true);
    }

    setTimeout(() => {
      this.index.set(1);
    }, 100);
  }

  async login() {
    // Track login click event
    if (this.appNameService.isPillar()) {
      this.eventService.sendEvent({
        eventName: 'LogInClick',
        eventData: {},
      });
      this.eventManagementService.triggerEvent({
        eventType: 'click',
        data: {
          target: 'login-button',
        },
      });
    }
    let superAppToken: string | null = '';
    if (this.digikalaSuperWebService.isDgkSuperWebUser) {
      superAppToken = this.digikalaSuperWebService.saTokenDGK;
    } else if (this.digikalaService.isDigikalaSuperApp) {
      superAppToken = this.digikalaService.getSuperAppToken();
    }
    const accessToken = this.storageService.getToken();

    if (superAppToken) {
      // If we have super app token but no access token, request to /auth/idp
      if (!accessToken) {
        try {
          await this.authDigikalaService.loginDigiPayToDigikala(superAppToken);
        } catch (error) {
          console.error('Failed to authenticate with super app token:', error);
          // If authentication fails, trigger native login
          return;
        }
      }
      // Navigate to home - auth resolver will handle authentication
      await this.router.navigate(['/home']);
    } else {
      if (this.digikalaSuperWebService.isDgkSuperWebUser) {
        this.digikalaSuperWebService.goToSsoDigikala();
      } else if (this.digikalaService.isDigikalaSuperApp) {
        this.digikalaService.login();
      }
    }
  }
}
