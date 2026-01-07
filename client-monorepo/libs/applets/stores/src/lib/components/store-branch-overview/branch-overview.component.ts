import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonIcon, NgxButtonComponent } from '@digipay/ngx-button';
import { NgxIcon } from '@digipay/ngx-icon';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import { BranchModel } from '@client-monorepo/stores';
import { ActionHandlerService } from '@client-monorepo/common/action-handler';
import { DeviceDetector } from '@client-monorepo/common/utilities';
import { Router } from '@angular/router';

@Component({
  selector: 'stores-applet-branch-overview',
  standalone: true,
  imports: [CommonModule, NgxButtonComponent, NgxIcon, NgxBadgeModule],
  templateUrl: './branch-overview.component.html',
  styleUrl: './branch-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchOverviewComponent {
  // Injections
  deviceDetector = inject(DeviceDetector);
  actionHandler = inject(ActionHandlerService);
  router = inject(Router);

  // Inputs
  branch = input.required<BranchModel>();
  mode = input<'COMPACT' | 'EXTENDED'>('COMPACT');
  showBadge = input<boolean>(false);
  showNavBtn = computed(() => !!this.branch().location);
  showDetailsBtn = computed(() => !!this.branch().storeTrackingCode);

  // Variables
  leftIcon: ButtonIcon = {
    name: 'arrow-left',
  };

  goToDetails() {
    this.router.navigate(['stores', this.branch().storeTrackingCode]);
  }

  goToGoogleMap(): void {
    const branch = this.branch();
    if (this.deviceDetector.isIphone()) {
      this.handleRedirectionInIOS();
    } else {
      window.open(`https://maps.google.com/?q=${branch.location.latitude},${branch.location.longitude}`, '_blank');
    }
  }

  handleRedirectionInIOS(): void {
    const branch = this.branch();
    const query = `${branch.location.latitude},${branch.location.longitude}`;
    const appUrl = `comgooglemaps://?q=${query}`;
    const fallback = `https://www.google.com/maps/search/?api=1&query=${query}`;

    const start = Date.now();
    setTimeout(() => {
      if (Date.now() - start < 2000) {
        window.open(fallback, '_blank');
      }
    }, 1500);
    window.open(appUrl, '_blank');
  }

  makeCall(): void {
    const number = this.branch().phoneNumber;
    if (!number) return;
    window.open(`tel:${number}`, '_self');
  }
}
