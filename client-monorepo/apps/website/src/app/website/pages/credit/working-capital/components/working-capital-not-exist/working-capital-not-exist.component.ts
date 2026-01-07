import {Component, Inject, Input, PLATFORM_ID} from '@angular/core';
import {BaseHttpClient} from '../../../../../../api/base-http-client';
import {UserService} from '../../../../../../core/services/user.service';
import {environment} from '../../../../../../../environments/environment';
import {DeviceService} from '../../../../../../core/services/device/device.service';
import {UiButtonComponent} from '../../../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {Platform} from "esbuild";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-working-capital-not-exist',
  templateUrl: './working-capital-not-exist.component.html',
  styleUrls: ['./working-capital-not-exist.component.scss'],
  standalone: true,
  imports: [UiButtonComponent],
})
export class WorkingCapitalNotExistComponent {
  @Input() error: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };

  constructor(
    private apiService: BaseHttpClient,
    private deviceService: DeviceService,
    private user: UserService,
    @Inject(PLATFORM_ID) private platformId: string,
  ) {
  }

  onClick(link: string) {
    if (link === 'users/logout') {
      this.apiService
        .post('users/logout', {
          deviceId: this.deviceService.generateDeviceUid(),
        })
        .subscribe((result) => {
          this.user.logout(false, '/merchants-seller/');
        });
    } else if (link === 'scroll') {
      const El = document.getElementById('form');
      if (El) {
        El.scrollIntoView({block: 'center', inline: 'nearest'});
      }
    } else {
      if (isPlatformBrowser(this.platformId)){
        window.location.href = `${environment.appUrl}/service/credit/overview`;
      }
    }
  }
}
