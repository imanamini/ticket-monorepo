import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { UserPreviewComponent } from '../../components/user-preview/user-preview.component';
import {ProfileMenuGroupComponent} from "../../components/profile-menu/profile-menu.component";
import {ProfileMenuItemInterface} from "../../data-access/models/profile-menu-group-item.interface";
import {StorageService} from "@client-monorepo/common/utilities";
import {AuthService} from "@client-monorepo/common/user";

@Component({
  selector: 'escrow-profile-applet-profile',
  standalone: true,
  imports: [UserPreviewComponent, ProfileMenuGroupComponent],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EscrowProfileComponent {
  authService = inject(AuthService);

  onItemAction(item: ProfileMenuItemInterface) {
    if (item.isEmitter){
        this.logout();
    }
  }

  logout(){
    this.authService.logout();
  }
}
