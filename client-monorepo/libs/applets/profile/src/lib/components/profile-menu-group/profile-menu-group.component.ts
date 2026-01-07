import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMenuGroupItemInterface } from '../../data-access/models/profile-menu-group-item.interface';
import { Router } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'profile-applet-profile-menu-group',
  standalone: true,
  imports: [CommonModule, DpIconComponent],
  templateUrl: './profile-menu-group.component.html',
  styleUrl: './profile-menu-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuGroupComponent {
  groupTitle = input<string>();
  items = input.required<Array<ProfileMenuGroupItemInterface>>();
  onAction = output<ProfileMenuGroupItemInterface>();

  router = inject(Router);

  getItemLink(item: ProfileMenuGroupItemInterface): string | Array<string> {
    return !item.disabled && item.link ? item.link : '#';
  }

  decideForClick(item: ProfileMenuGroupItemInterface): void {
    if (!item.disabled) {
      if (item.isEmitter) {
        this.onAction.emit(item);
      } else {
        this.router.navigate([...this.getItemLink(item)]);
      }
    }
  }
}
