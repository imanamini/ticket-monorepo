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
import { JourneyNamesModel } from '../models/journey-names.model';
import { UsedApiService } from '../../api/services/used/used-api.service';
import { SharedUsedService } from '../../routes/used/services/shared-used.service';
import { RenewalApiService } from '../../api/services/renewal/renewal-api.service';
import { SharedRenewalService } from '../../routes/renewal/services/shared-renewal.service';
import { HealthCheckInitComponent } from './partials/health-check-init/health-check-init.component';
import { HealthCheckSucceedComponent } from './partials/health-check-succeed/health-check-succeed.component';
import { HealthCheckFullScreenComponent } from './partials/health-check-full-screen/health-check-full-screen.component';
import { HealthCheckTimerComponent } from './partials/health-check-timer/health-check-timer.component';
import { DOCUMENT } from '@angular/common';
import { HealthCheckResultComponent } from './partials/health-check-result/health-check-result.component';
import { LocationTrapComponent } from '../../../../components/location-trap/location-trap.component';
import { OrderModel } from '../../api/models/renewal/order.model';
import { HealthCheckBodyModel } from '../../api/models/renewal/health-check-body.model';
import { IntrackService } from '../../../../data-access/services/intrack.service';
import { INSURANCE_APP_PREFIX } from '../../../../data-access/constants/insurance-app-prefix.constant';

@Component({
  selector: 'health-check',
  templateUrl: './health-check.component.html',
  standalone: true,
  styleUrls: ['./health-check.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HealthCheckTimerComponent, HealthCheckResultComponent, LocationTrapComponent],
})
export class HealthCheckComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly JourneyNamesModel = JourneyNamesModel;
  @Input()
  testTimeMinute = 1;
  @Input()
  journey: JourneyNamesModel;
  uniqueCode: string;
  osName = getOsName();
  isDialogAvailable = false;
  fullScreenChangeEventEmitter = new EventEmitter<boolean>();
  holdFullScreen = true;
  isFullScreen: boolean;
  showTimer = signal<boolean>(false);
  showTestFailed = signal<boolean>(false);
  isMobileDevice: boolean;
  orderInfo: OrderModel;

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
  service: SharedUsedService | SharedRenewalService;
  apiService: UsedApiService | RenewalApiService;

  private subscriptions: Subscription = new Subscription();
  private timerSubscription: Subscription = new Subscription();
  private container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  private isInteracting = false;
  private totalElements = 100;
  private changedElements = 0;

  private renderer: Renderer2 = inject(Renderer2);
  private bottomSheet: MatBottomSheet = inject(MatBottomSheet);
  private messageService: MessageService = inject(MessageService);
  private intrackService: IntrackService = inject(IntrackService);
  private usedApiService: UsedApiService = inject(UsedApiService);
  private usedSharedService: SharedUsedService = inject(SharedUsedService);
  private renewalApiService: RenewalApiService = inject(RenewalApiService);
  private renewalSharedService: SharedRenewalService = inject(SharedRenewalService);

  @HostListener('window:popstate', ['$event'])
  onPopstate(event: Event): void {
    if (this.document.fullscreenElement) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit(): void {
    if (this.journey === JourneyNamesModel.RENEWAL) {
      this.service = this.renewalSharedService;
      this.apiService = this.renewalApiService;
    } else if (this.journey === JourneyNamesModel.USED_DEVICE) {
      this.service = this.usedSharedService;
      this.apiService = this.usedApiService;
    }
    this.service.setJourney(this.journey);
    this.isMobileDevice = this.osName === OsNames.iOS || this.osName === OsNames.Android;
    this.getOrderInfo();
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

  getOrderInfo(): void {
    const subscription = this.service.getOrderInfo().subscribe({
      next: (res) => {
        this.orderInfo = res;
      },
    });

    this.subscriptions.add(subscription);
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
    this.subscriptions.add(subscription);
  }

  handleFullscreenChange(): void {
    this.isFullScreen = !!this.document.fullscreenElement;
    this.fullScreenChangeEventEmitter.emit(this.isFullScreen);
  }

  getUniqueCode(): void {
    const subscription = this.service.getUniqueCode().subscribe({
      next: (code) => {
        this.uniqueCode = code ? code : null;
      },
    });
    this.subscriptions.add(subscription);
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
      const refDialog = this.bottomSheet
        .open(sheet.component, {disableClose: true, data: this.journey})
        .afterDismissed()
        .toPromise()
        .then((res) => {
          this.isDialogAvailable = false;
          sheet.callback();
        });
    }
  }

  setHealthCheckResult(): void {
    const body: HealthCheckBodyModel = {
      key: this.uniqueCode,
      healthCheck: this.changedElements === this.totalElements,
    };
    const subscription = this.apiService.setHealthCheck(body).subscribe({
      next: (res) => {
        const baseUrl = this.journey === JourneyNamesModel.RENEWAL ? 'equipment/renewal?code=' : 'equipment/used?code=';
        if (body.healthCheck) {
          this.sendIntrackEvent('I_STP');
          window.location.href = INSURANCE_APP_PREFIX + '/' + baseUrl + this.uniqueCode;
        }
      },
      error: (e) => {
        this.messageService.showErrorIfExists(e);
        this.showTestFailed.set(true);
      },
    });
    this.subscriptions.add(subscription);
  }

  sendIntrackEvent(eventName: string): void {
    if (this.journey === JourneyNamesModel.USED_DEVICE) {
      const orderInfoValue: OrderModel = this.usedSharedService.getOrderInfoValue();
      this.intrackService.sendIntrackEvent(eventName, {
        DeviceModel: orderInfoValue?.productModel ?? '',
        DeviceBrand: orderInfoValue?.productBrand ?? '',
        DevicePrice: orderInfoValue?.announcedPrice ?? 0,
        TotalAmountPaid: (orderInfoValue?.taxAmount || 0) + (orderInfoValue?.payableAmount || 0),
        VoucherUsed: !!orderInfoValue?.voucherId,
        PaymentWay: orderInfoValue?.paymentTicketTypeTitle ?? '',
        uniquecode: this.uniqueCode ?? '',
        DeviceIMEI: orderInfoValue?.serialNumber ?? '',
      });
    }
  }

  ngOnDestroy(): void {
    this.exitFullScreen();
    this.manipulateDom(false);
    this.subscriptions.unsubscribe();
    this.timerSubscription?.unsubscribe();
  }
}
