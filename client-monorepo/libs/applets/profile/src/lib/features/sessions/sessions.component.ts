import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceInfo, DeviceInfoService, MessageService } from '@client-monorepo/common/utilities';
import { AuthService, ClientInterface } from '@client-monorepo/common/user';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';
import { SessionCardComponent } from '../../components/session-card/session-card.component';
import { NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { ConfirmRevokeSessionComponent } from '../../components/confirm-revoke-session/confirm-revoke-session.component';
import { REVOKE_CONFIRM_CONFIG } from '../../data-access/constants/revoke-confirm-config.const';
import { RevokeType } from '../../data-access/models/revoke-type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'profile-applet-sessions',
  standalone: true,
  imports: [CommonModule, PageLayoutComponent, SessionCardComponent],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsComponent implements OnInit, OnDestroy {
  currentSession = signal<DeviceInfo>({});
  otherSession = signal<ClientInterface[]>([]);
  isLoading = signal(true);
  messageService = inject(MessageService);
  private deviceInfoService = inject(DeviceInfoService);
  private authService = inject(AuthService);
  private bottomNavigationService = inject(NgxBottomNavigationService);
  private bottomSheetService = inject(NgxBottomSheetService);
  untilDestroy = inject(DestroyRef);

  ngOnInit() {
    this.bottomNavigationService.hide();
    this.getCurrentSession();
    this.getDevices();
  }

  getCurrentSession() {
    this.deviceInfoService.getDeviceInfo().then((result) => {
      this.currentSession.set(result);
    });
  }

  getDevices() {
    this.authService
      .getSessionsData()
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe((res) => {
        const others = res.clients.filter((data) => {
          const currentDeviceId = this.currentSession().deviceId;
          return data?.device?.deviceId && data.device.deviceId !== currentDeviceId;
        });
        this.otherSession.set(others);
        this.isLoading.set(false);
      });
  }

  handleConfirmRevoke(deviceId: string, revokeType: RevokeType) {
    this.bottomSheetService.openBottomSheet(
      ConfirmRevokeSessionComponent,
      { config: REVOKE_CONFIRM_CONFIG[revokeType] },
      { noPadding: true },
    );
    const revokeConfirmSub = this.bottomSheetService.onClose.subscribe(() => {
      revokeConfirmSub.unsubscribe();
      if (!this.bottomSheetService.outputData()) {
        return;
      }
      this.deleteSession(deviceId, revokeType);
    });
  }

  private revokeStrategies: Record<RevokeType, (deviceId: string) => Observable<any>> = {
    single: (deviceId: string) => this.authService.revokeSession(deviceId),
    others: (deviceId: string) => this.authService.revokeOtherSessions([deviceId]),
  };

  deleteSession(deviceId: string, revokeType: RevokeType) {
    const strategy = this.revokeStrategies[revokeType];
    if (!strategy) {
      return;
    }

    strategy(deviceId)
      .pipe(takeUntilDestroyed(this.untilDestroy))
      .subscribe({
        next: (res) => {
          if (res.result.status === 0) {
            this.messageService.showSuccessMessage(res.result.message);
            this.getDevices();
          }
        },
        error: (error) => {
          this.messageService.showErrorOfErrorResponse(error);
        },
      });
  }

  ngOnDestroy(): void {
    this.bottomNavigationService.show();
  }
}
