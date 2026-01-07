import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HybridActionEnumsModel, NgxHybridService, PermissionListEnum } from '@digipay/ngx-hybrid-service';
import { Router } from '@angular/router';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { BackHandlerService } from '@client-monorepo/back-handler';

@Component({
  selector: 'scanner-applet-permission-denied',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent],
  templateUrl: './scanner-permission-denied.component.html',
  styleUrl: './scanner-permission-denied.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerPermissionDeniedComponent {
  private backHandlerService = inject(BackHandlerService);

  @Output() nativePermissionResult = new EventEmitter<boolean>();
  isHybrid = false;
  router = inject(Router);

  constructor(private ngxHybridService: NgxHybridService) {
    if (ngxHybridService.isHybrid()) {
      this.isHybrid = true;
      this.getCameraPermission();
    }
  }

  private getCameraPermission() {
    this.ngxHybridService
      .getPermissions([PermissionListEnum.CAMERA])
      .then((result: PermissionListEnum[]) => {
        const hasPermission = result.includes(PermissionListEnum.CAMERA);
        this.nativePermissionResult.emit(hasPermission);
      })
      .catch((error) => {
        console.warn('[ScannerPermissionDenied] Failed to get camera permissions from native bridge:', error);
        // Assume no permission on error
        this.nativePermissionResult.emit(false);
      });
  }

  goToSettingForGetPermission(): void {
    this.ngxHybridService.goToAction(HybridActionEnumsModel.APP_SETTING);
  }

  goBack() {
    this.backHandlerService.goBack();
  }
}
