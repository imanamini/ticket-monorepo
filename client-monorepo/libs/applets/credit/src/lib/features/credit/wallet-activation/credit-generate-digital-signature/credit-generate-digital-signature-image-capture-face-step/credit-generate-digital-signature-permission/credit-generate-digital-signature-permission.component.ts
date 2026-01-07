import { ChangeDetectionStrategy, Component, effect, inject, OnInit, output, signal } from '@angular/core';
import { MediaPermissionsError, MediaPermissionsErrorType } from 'mic-check';

import { NgxHybridServiceService, PermissionListEnum } from '@digipay/ngx-hybrid-service';
import { NgxStatusResultModule } from '@digipay/ngx-status-result';
import { Buttons } from '@digipay/ngx-status-result/lib/models/ngx-status-result.model';
import { CreditPageLoadingComponent } from '../../../../components/credit-page-loading/credit-page-loading.component';
import { CreditAppBarComponent } from '../../../../components/credit-app-bar/credit-app-bar.component';
import { CreditDigikalaService } from '../../../../data-access/services/pillar/credit-digikala.service';

type MediaPermissionType = 'microphone' | 'camera';

@Component({
  selector: 'app-credit-generate-digital-signature-permission',
  standalone: true,
  imports: [NgxStatusResultModule, CreditPageLoadingComponent, CreditAppBarComponent],
  templateUrl: './credit-generate-digital-signature-permission.component.html',
  styleUrl: './credit-generate-digital-signature-permission.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditGenerateDigitalSignaturePermissionComponent implements OnInit {
  buttons: Buttons[] = [
    {
      id: 'digitalSignaturePermissionConfirmButton',
      style: 'fill',
      mode: 'form',
      fullWidth: true,
      label: 'تایید دسترسی',
    },
  ];
  back = output();
  changeState = output<'FAILED' | 'CAPTURE'>();
  hasPermission = signal({
    audio: false,
    video: false,
  });
  showLoading = signal(true);
  hybridService = inject(NgxHybridServiceService);
  creditDigikalaService = inject(CreditDigikalaService);

  constructor() {
    effect(() => {
      const permission = this.hasPermission();
      if (permission.audio && permission.video) {
        this.changeState.emit('CAPTURE');
      }
    });
  }

  async ngOnInit() {
    if (this.creditDigikalaService.isDigikalaSuperApp) {
      await this.getDigikalaAppPermissions();
      return;
    }
    if (this.hybridService.isHybrid()) {
      await this.getPermissionInHybrid();
      return;
    }
    this.showLoading.set(true);
    this.checkPermissions()
      .then((result) => {
        this.hasPermission.update((x) => ({
          ...x,
          audio: result.microphone.granted,
        }));
        this.hasPermission.update((x) => ({
          ...x,
          video: result.camera.granted,
        }));
        this.showLoading.set(false);
      })
      .catch((error) => {
        console.error('Error during permission check:', error);
        this.checkCameraAndMicPermissions().then((permissions) => {
          if (permissions.camera === 'granted' && permissions.microphone === 'granted') {
            this.hasPermission.update((x) => ({ ...x, audio: true }));
            this.hasPermission.update((x) => ({ ...x, video: true }));
            console.log('Both camera and microphone permissions are granted');
          } else {
            this.changeState.emit('FAILED');
            this.showLoading.set(false);
            console.log('One or both permissions are not granted');
          }
        });
      });
  }

  async getDigikalaAppPermissions() {
    const requestCamera = () =>
      new Promise<boolean>((resolve) => {
        this.creditDigikalaService.requestCameraPermission(resolve);
      });

    const requestAudio = () =>
      new Promise<boolean>((resolve) => {
        this.creditDigikalaService.requestRecordAudioPermission(resolve);
      });

    const videoGranted = await requestCamera();
    this.hasPermission.update((x) => ({ ...x, video: videoGranted }));

    const audioGranted = await requestAudio();
    this.hasPermission.update((x) => ({ ...x, audio: audioGranted }));
  }

  onBackClick() {
    this.back.emit();
  }

  onCtaClick() {
    this.requestCameraAndMic();
  }

  isFirefox() {
    return navigator.userAgent.toLowerCase().includes('firefox');
  }

  async requestCameraAndMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: true,
      });
      this.showLoading.set(false);
      this.changeState.emit('CAPTURE');
      console.log('Permission granted for camera and microphone', stream);
      stream.getTracks().forEach((track) => track.stop());
    } catch (error: any) {
      this.showLoading.set(false);
      const { type } = error as { type: MediaPermissionsErrorType };
      this.changeState.emit('FAILED');
      console.error('Error accessing camera and microphone:', error);
    }
  }

  async checkPermissions(): Promise<Record<MediaPermissionType, { granted: boolean }>> {
    const permissions: Record<MediaPermissionType, { granted: boolean }> = {
      microphone: { granted: false },
      camera: { granted: false },
    };

    if ('permissions' in navigator && navigator.permissions && !this.isFirefox()) {
      for (const device of ['microphone', 'camera'] as const) {
        try {
          const result = await navigator.permissions.query({
            name: device as PermissionName,
          });
          permissions[device].granted = result.state === 'granted';

          console.log(`${device} permission state:`, result.state);

          if (result.state === 'denied') {
            this.changeState.emit('FAILED');
          }
        } catch (error) {
          console.warn(`Error checking ${device} permission:`, error);
          this.changeState.emit('FAILED');
        }
      }
    } else if (navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: 'user' },
          audio: true,
        })
        .then((stream) => {
          permissions.microphone.granted = true;
          permissions.camera.granted = true;
          this.hasPermission.update((x) => ({
            ...x,
            audio: permissions.microphone.granted,
          }));
          this.hasPermission.update((x) => ({
            ...x,
            video: permissions.camera.granted,
          }));
          console.log('Permissions granted:', permissions);
          stream.getTracks().forEach((track) => track.stop());
        })
        .catch((err: MediaPermissionsError) => {
          console.log('Error requesting media permissions:', err);
          const { type } = err;
          this.changeState.emit('FAILED');
        });
    } else {
      console.warn('Neither Permissions API nor getUserMedia are supported');
      this.changeState.emit('FAILED');
    }

    return permissions;
  }

  async checkCameraAndMicPermissions() {
    try {
      const cameraPermission = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });
      const microphonePermission = await navigator.permissions.query({
        name: 'microphone' as PermissionName,
      });

      console.log('Camera permission state:', cameraPermission.state);
      console.log('Microphone permission state:', microphonePermission.state);

      return {
        camera: cameraPermission.state,
        microphone: microphonePermission.state,
      };
    } catch (error) {
      console.error('Error checking permissions:', error);
      return {
        camera: 'error',
        microphone: 'error',
      };
    }
  }

  private async getPermissionInHybrid() {
    try {
      const permissions = await this.hybridService.getPermissions([PermissionListEnum.CAMERA, PermissionListEnum.AUDIO]);
      if (permissions.includes(PermissionListEnum.CAMERA) && permissions.includes(PermissionListEnum.AUDIO)) {
        if (this.hybridService.isIosHybrid()) {
          await this.requestCameraAndMic();
          return;
        }
        this.hasPermission.update((x) => ({ ...x, audio: true }));
        this.hasPermission.update((x) => ({ ...x, video: true }));
      } else {
        this.changeState.emit('FAILED');
      }
    } catch {
      this.changeState.emit('FAILED');
    }
  }
}
