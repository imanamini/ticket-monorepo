import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { SessionOsName } from '../../data-access/models/sessions.model';
import { ClientInterface } from '@client-monorepo/common/user';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'profile-applet-session-card',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxButtonComponent],
  templateUrl: './session-card.component.html',
  styleUrls: ['./session-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCardComponent {
  sessionTitle = input<string>('');
  sessions = input<ClientInterface[]>([]);
  isCurrentSession = input<boolean>(false);
  hasLastLoginInfo = input<boolean>(false);
  hasOtherSessions = input<boolean>(false);
  hasOtherSessionsRevoking = computed(() => this.isCurrentSession() && this.hasOtherSessions());
  modifiedSessions = computed(() => {
    return this.sessions().map((session) => {
      const device = session.device ?? {};
      const osName = device.osName || '';
      const model = device.deviceModel || '';
      const version = device.appVersion || '';

      return {
        ...session,
        device: {
          ...device,
          deviceMappedName: this.getDeviceName(osName, model),
          deviceMappedVersion: this.getDeviceVersion(osName, version),
        },
      };
    });
  });
  removeSessionClicked = output<string>();

  getDeviceName(osName: string, deviceModel: string): string {
    const deviceModelName = deviceModel ? deviceModel : '';
    switch (osName) {
      case 'WEB':
        return `مرورگر ${deviceModelName}`;
      case 'ANDROID':
        return `${deviceModelName}`;
      case 'IOS':
        return `${deviceModelName}`;
      default:
        return 'نامشخص';
    }
  }

  getDeviceVersion(osName: string, appVersion: string) {
    const appVersionName = appVersion ? '، ورژن ' + appVersion : '';
    switch (osName) {
      case 'WEB':
        return `نسخه وب دیجی‌پی${appVersionName || '، ورژن 1.0'}`;
      case 'ANDROID':
        return `نسخه Android${appVersionName}`;
      case 'IOS':
        return `نسخه Ios${appVersionName}`;
      default:
        return 'نامشخص';
    }
  }

  deleteSessionClicked(deviceId: string): void {
    this.removeSessionClicked.emit(deviceId);
  }

  protected readonly SessionOsName = SessionOsName;
}
