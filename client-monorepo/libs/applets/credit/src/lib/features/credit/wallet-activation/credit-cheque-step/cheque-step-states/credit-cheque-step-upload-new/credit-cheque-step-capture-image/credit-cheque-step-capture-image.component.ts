import { ChangeDetectionStrategy, Component, effect, inject, OnInit, output, signal } from '@angular/core';
import { NgxHybridServiceService, PermissionListEnum } from '@digipay/ngx-hybrid-service';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { CreditChequeStepCameraAccessDeniedComponent } from '../credit-cheque-step-camera-access-denied/credit-cheque-step-camera-access-denied.component';
import { CreditChequeStepCameraPermissionComponent } from '../credit-cheque-step-camera-permission/credit-cheque-step-camera-permission.component';
import { CreditChequeStepCameraCaptureComponent } from '../credit-cheque-step-camera-capture/credit-cheque-step-camera-capture.component';
import { CreditPageLoadingComponent } from '../../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../../components/credit-app-bar/credit-app-bar.component';

type MediaPermissionType = 'camera';

@Component({
  selector: 'app-credit-cheque-step-capture-image',
  templateUrl: './credit-cheque-step-capture-image.component.html',
  styleUrls: ['./credit-cheque-step-capture-image.component.scss'],
  imports: [
    NgxStatusResultModule,
    CreditChequeStepCameraAccessDeniedComponent,
    CreditChequeStepCameraPermissionComponent,
    CreditChequeStepCameraCaptureComponent,
    CreditPageLoadingComponent,
    CreditAppBarComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditChequeStepCaptureImageComponent implements OnInit {
  hasPermission = signal({
    video: false,
  });
  state = signal<'GRANTED' | 'DENIED' | 'INITIAL'>('INITIAL');
  showLoading = signal(true);
  captureEvent = output<File>();
  close = output<void>();
  hybridService = inject(NgxHybridServiceService);

  constructor() {
    effect(
      () => {
        const permission = this.hasPermission();
        if (permission.video) {
          this.showLoading.set(false);
          this.state.set('GRANTED');
        }
      },
      { allowSignalWrites: true },
    );
  }

  async ngOnInit() {
    if (this.hybridService.isHybrid()) {
      await this.getPermissionInHybrid();
      return;
    }
    this.showLoading.set(true);
    this.checkPermissions()
      .then((result) => {
        this.hasPermission.update((x) => ({
          ...x,
          video: result.camera.granted,
        }));
        this.showLoading.set(false);
      })
      .catch(() => {
        this.checkCameraPermissions().then((permissions) => {
          if (permissions.camera === 'granted') {
            this.hasPermission.update((x) => ({ ...x, video: true }));
          } else {
            this.state.set('DENIED');
            this.showLoading.set(false);
          }
        });
      });
  }

  isFirefox() {
    return navigator.userAgent.toLowerCase().includes('firefox');
  }

  async checkCameraPermissions() {
    try {
      const cameraPermission = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });
      return {
        camera: cameraPermission.state,
      };
    } catch (error) {
      return {
        camera: 'error',
      };
    }
  }

  async checkPermissions(): Promise<Record<MediaPermissionType, { granted: boolean }>> {
    const permissions: Record<MediaPermissionType, { granted: boolean }> = {
      camera: { granted: false },
    };
    if ('permissions' in navigator && navigator.permissions && !this.isFirefox()) {
      for (const device of ['camera'] as const) {
        try {
          const result = await navigator.permissions.query({
            name: device as PermissionName,
          });
          permissions[device].granted = result.state === 'granted';

          if (result.state === 'denied') {
            this.state.set('DENIED');
            this.showLoading.set(false);
          }
        } catch (error) {
          this.state.set('DENIED');
          this.showLoading.set(false);
        }
      }
    } else if (navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        .then((stream) => {
          permissions.camera.granted = true;
          this.hasPermission.update((x) => ({
            ...x,
          }));
          this.hasPermission.update((x) => ({
            ...x,
            video: permissions.camera.granted,
          }));
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch(() => {
          this.state.set('DENIED');
          this.showLoading.set(false);
        });
    } else {
      this.state.set('DENIED');
      this.showLoading.set(false);
    }

    return permissions;
  }

  async requestCamera() {
    this.showLoading.set(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      this.showLoading.set(false);
      this.hasPermission.update((x) => ({ ...x, video: true }));
      stream.getTracks().forEach((track) => track.stop());
    } catch (error: any) {
      this.showLoading.set(false);
      this.state.set('DENIED');
    }
  }

  onConfirm(file: File | null) {
    if (file) {
      this.captureEvent.emit(file);
    }
  }

  private async getPermissionInHybrid() {
    try {
      const permissions = await this.hybridService.getPermissions([PermissionListEnum.CAMERA]);
      if (permissions.includes(PermissionListEnum.CAMERA)) {
        if (this.hybridService.isIosHybrid()) {
          await this.requestCamera();
          return;
        }
        this.hasPermission.update((x) => ({ ...x, video: true }));
      } else {
        this.state.set('DENIED');
        this.showLoading.set(false);
      }
    } catch {
      this.state.set('DENIED');
      this.showLoading.set(false);
    }
  }
}
