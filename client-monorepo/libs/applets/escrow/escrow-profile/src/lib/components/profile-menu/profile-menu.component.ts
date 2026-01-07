import {ChangeDetectionStrategy, Component, inject, output, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMenuItemInterface } from '../../data-access/models/profile-menu-group-item.interface';
import { Router } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { ESCROW_PROFILE_MENU } from '../../data-access/constants/profile-menu.const';
import { NgxBadgeModule } from '@digipay/ngx-badge';
import {
  ProfileMenuGroupItemInterface
} from "../../../../../../profile/src/lib/data-access/models/profile-menu-group-item.interface";

@Component({
  selector: 'escrow-profile-applet-profile-menu',
  standalone: true,
  imports: [CommonModule, DpIconComponent, NgxBadgeModule],
  templateUrl: './profile-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuGroupComponent {
  items = signal<ProfileMenuItemInterface[]>(ESCROW_PROFILE_MENU);
  router = inject(Router);
  onAction = output<ProfileMenuItemInterface>();

  getItemLink(item: ProfileMenuItemInterface): string | Array<string> {
    return !item.disabled && item.link ? item.link : '#';
  }

  decideForClick(item: ProfileMenuItemInterface): void {
    if (!item.disabled) {
      if (item.isEmitter) {
        this.onAction.emit(item);
      } else {
        this.router.navigate([...this.getItemLink(item)]);
      }
    }
  }
}
