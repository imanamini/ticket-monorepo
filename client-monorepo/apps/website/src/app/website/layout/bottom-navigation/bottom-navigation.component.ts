import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { BottomNavigationModel } from './bottom-navigation.model';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [CommonModule, NgxIcon],
  templateUrl: './bottom-navigation.component.html',
  styleUrl: './bottom-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavigationComponent {
  appUrl = environment.appUrl;

  bottomNavigation: WritableSignal<BottomNavigationModel[]> = signal([
    { title: 'خانه', logo: 'home', link: '/', isActive: false , showBadge:false},
    { title: 'خدمات', logo: 'more', link: '/hub', isActive: false, showBadge:false },
    { title: 'فروشگاه‌ها', logo: 'bag', link: '/stores', isActive: false, showBadge:true },
    { title: 'پرداخت', logo: 'card-to-card',link: `${this.appUrl}/transactions`, isActive: false, showBadge:false  },
    { title: 'ورود', logo: 'person', link: this.appUrl, isActive: false, showBadge:false },
  ]);

  setActiveItem(selectedItem: BottomNavigationModel): void {
    this.bottomNavigation.update((items) =>
      items.map((item) => ({
        ...item,
        isActive: item === selectedItem,
      })),
    );
  }
}
