import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
  viewChild,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Subscription, timer } from 'rxjs';
import { OsNames } from '../../../../data-access/services/device/os-names';
import { getOsName, MessageService } from '@client-monorepo/common/utilities';
import { HealthCheckInitComponent } from './components/health-check-init/health-check-init.component';
import { HealthCheckSucceedComponent } from './components/health-check-succeed/health-check-succeed.component';
import { HealthCheckFullScreenComponent } from './components/health-check-full-screen/health-check-full-screen.component';
import { HealthCheckTimerComponent } from './components/health-check-timer/health-check-timer.component';
import { DOCUMENT } from '@angular/common';
import { HealthCheckResultComponent } from './components/health-check-result/health-check-result.component';
import { LocationTrapComponent } from '../../../../components/location-trap/location-trap.component';
import { HealthCheckBodyModel } from '../../../equipment/api/models/renewal/health-check-body.model';
import { BaseComponent } from '../../../../components/base/base.component';
import { SubscriptionApiService } from '../../data-access/services/subscription-api.service';
import { SUBSCRIPTION_QUERY_PARAMS } from '../../data-access/constants/subscription-query-params';
import { Router } from '@angular/router';
import { SUBSCRIPTION_URLS } from '../../data-access/constants/subscription-urls';

@Component({
  selector: 'health-check',
  templateUrl: './health-check.component.html',
  standalone: true,
  styleUrls: ['./health-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HealthCheckTimerComponent, HealthCheckResultComponent, LocationTrapComponent],
})
export class HealthCheckComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  testTimeMinute = 1;
  uniqueCode: string;
  osName = getOsName();
  isDialogAvailable = false;
  fullScreenChangeEventEmitter = new EventEmitter<boolean>();
  holdFullScreen = true;
  isFullScreen: boolean;
  showTimer = signal<boolean>(false);
  showTestFailed = signal<boolean>(false);
  isMobileDevice: boolean;

  dialogs: any = {
    initDialogBundle: {
      component: HealthCheckInitComponent,
      callback: () => {
        this.requestFullscreen();
        this.setTimer();
        this.showTimer.set(true);
      },
    },
    succeedDialogBundle: {
      component: HealthCheckSucceedComponent,
      callback: () => {
        this.setHealthCheckResult();
      },
    },

    fullScreenDialogBundle: {
      component: HealthCheckFullScreenComponent,
      callback: () => {
        this.requestFullscreen();
      },
    },
  };
  apiService = inject(SubscriptionApiService);

  private timerSubscription: Subscription = new Subscription();
  private container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  private isInteracting = false;
  private totalElements = 100;
  private changedElements = 0;

  private renderer = inject(Renderer2);
  private bottomSheet = inject(MatBottomSheet);
  private messageService = inject(MessageService);
  private router = inject(Router);

  @HostListener('window:popstate', ['$event'])
  onPopstate(event: Event): void {
    if (this.document.fullscreenElement) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  constructor(@Inject(DOCUMENT) private document: Document) {
    super();
  }

  ngOnInit(): void {
    this.isMobileDevice = this.osName === OsNames.iOS || this.osName === OsNames.Android;
    this.getUniqueCode();
    this.startProcess();
    this.addMetaTag();
  }

  ngAfterViewInit(): void {
    for (let i = 0; i < this.totalElements; i++) {
      const element = this.renderer.createElement('div');
      element.className = 'matrix-element';
      element.setAttribute('data-changed', 'false');
      this.renderer.appendChild(this.container()?.nativeElement, element);
    }
  }

  public onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.isInteracting = true;
    this.handleInteraction(event.touches[0]);
  }

  public onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    if (this.isInteracting) {
      this.handleInteraction(event.touches[0]);
    }
  }

  public onTouchEnd(event: TouchEvent): void {
    this.isInteracting = false;
  }

  private handleInteraction(event: Touch): void {
    const elementUnderPointer = this.document.elementFromPoint(event.clientX, event.clientY);
    if (elementUnderPointer?.classList?.contains('matrix-element') && elementUnderPointer?.getAttribute('data-changed') === 'false') {
      elementUnderPointer.classList.add('changed');
      elementUnderPointer.setAttribute('data-changed', 'true');
      this.changedElements++;

      if (this.changedElements === this.totalElements) {
        this.showTestFailed.set(false);
        this.timerSubscription.unsubscribe();
        this.handleDialog('succeedDialogBundle');
      }
    }
  }

  startProcess(): void {
    this.showTestFailed.set(false);
    this.handleDialog('initDialogBundle');
    this.manipulateDom(true);
  }

  addMetaTag(): void {
    const metaTag = this.document.createElement('meta');
    metaTag.name = 'apple-mobile-web-app-capable';
    metaTag.content = 'yes';
    this.document.head.appendChild(metaTag);
    const metaTag2 = this.document.createElement('meta');
    metaTag2.name = 'apple-mobile-web-app-status-bar-style';
    metaTag2.content = 'black';
    this.document.head.appendChild(metaTag2);
    window.scrollTo(0, 1);
  }

  requestFullscreen(): void {
    this.holdFullScreen = true;
    const doc = this.document.documentElement;
    if (doc.requestFullscreen) {
      doc
        .requestFullscreen()
        .then()
        .catch((error) => {
          console.error(error);
        });
    }
    this.document.onfullscreenchange = () => {
      this.isFullScreen = !!this.document.fullscreenElement;
    };
    this.subscribeToFullscreenChanges();
  }

  exitFullScreen(): void {
    this.holdFullScreen = false;
    if (this.document.fullscreenElement) {
      this.document?.exitFullscreen().then();
    }
  }

  subscribeToFullscreenChanges(): void {
    this.document.addEventListener(
      'fullscreenchange',
      (e) => {
        this.handleFullscreenChange();
      },
      false,
    );
    const subscription = this.fullScreenChangeEventEmitter.subscribe({
      next: (data) => {
        if (!data && this.holdFullScreen) {
          this.handleDialog('fullScreenDialogBundle');
        }
      },
    });
    super.addSubscription(subscription);
  }

  handleFullscreenChange(): void {
    this.isFullScreen = !!this.document.fullscreenElement;
    this.fullScreenChangeEventEmitter.emit(this.isFullScreen);
  }

  getUniqueCode(): void {
    this.uniqueCode = this.activatedRoute.snapshot.queryParams[SUBSCRIPTION_QUERY_PARAMS.POLICY_KEY];
  }

  setTimer(): void {
    const timeMillis = this.testTimeMinute * 60 * 1000;
    this.timerSubscription.add(
      timer(timeMillis).subscribe(() => {
        this.showTestFailed.set(true);
        this.setHealthCheckResult();
      }),
    );
  }

  manipulateDom(isInitial: boolean): void {
    if (isInitial) {
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
      this.renderer.setStyle(this.document.body, 'height', '100vh');
      this.renderer.setStyle(this.document.body, 'overscroll-behavior', 'none');
    } else {
      this.renderer.removeStyle(this.document.body, 'overflow');
      this.renderer.removeStyle(this.document.body, 'height');
    }
  }

  handleDialog(bundleName: string): void {
    const sheet = this.dialogs[bundleName];
    if (!this.isDialogAvailable) {
      this.isDialogAvailable = true;
      super.addSubscription(
        this.bottomSheet
          .open(sheet.component, { disableClose: true })
          .afterDismissed()
          .subscribe((res) => {
            this.isDialogAvailable = false;
            sheet.callback();
          }),
      );
    }
  }

  setHealthCheckResult(): void {
    const body: HealthCheckBodyModel = {
      key: this.uniqueCode,
      healthCheck: this.changedElements === this.totalElements,
    };
    const subscription = this.apiService.setHealthCheck(body).subscribe({
      next: (res) => {
        if (body.healthCheck) {
          this.router.navigate([SUBSCRIPTION_URLS.COMPLETE_JOURNEY], {
            queryParamsHandling: 'preserve',
          });
        }
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
        this.showTestFailed.set(true);
      },
    });
    super.addSubscription(subscription);
  }

  ngOnDestroy(): void {
    this.exitFullScreen();
    this.manipulateDom(false);
    this.timerSubscription?.unsubscribe();
  }
}
