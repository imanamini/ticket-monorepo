import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileMenuGroupComponent } from '../profile-menu-group/profile-menu-group.component';
import { ProfileMenuGroupItemInterface } from '../../data-access/models/profile-menu-group-item.interface';
import { Router } from '@angular/router';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

@Component({
  selector: 'profile-applet-guide-chooser',
  standalone: true,
  imports: [CommonModule, ProfileMenuGroupComponent],
  templateUrl: './guide-chooser.component.html',
  styleUrl: './guide-chooser.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideChooserComponent {
  guides: Array<ProfileMenuGroupItemInterface> = [
    {
      title: 'راهنمای اپلیکیشن دیجی‌پی',
      link: ['/profile', 'guide', 'app'],
      isEmitter: true,
    },
    {
      title: 'راهنمای بخش دریافت وام',
      link: ['/profile', 'guide', 'credit'],
      isEmitter: true,
    },
  ];

  router = inject(Router);
  bottomSheetService = inject(NgxBottomSheetService);

  goToGuidePage(item: ProfileMenuGroupItemInterface): void {
    this.bottomSheetService.closeBottomSheet();
    this.router.navigate([...item.link!]);
  }
}
