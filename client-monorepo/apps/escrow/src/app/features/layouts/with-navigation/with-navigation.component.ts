import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BottomNavigationItemInterface, NgxBottomNavigationService } from '@digipay/ngx-bottom-navigation';

@Component({
  selector: 'escrow-with-navigation',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './with-navigation.component.html',
  styleUrl: './with-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WithNavigationComponent implements OnInit {
  bottomNavigationService = inject(NgxBottomNavigationService);
  navigationItems: Array<BottomNavigationItemInterface> = [
    {
      title: 'خانه',
      icon: 'home',
      route: '/home',
    },
    {
      title: 'سفارش ها',
      icon: 'bag',
      route: '/orders',
    },
    {
      title: 'پروفایل',
      icon: 'person',
      route: '/profile',
    },
  ];
  ngOnInit() {
    this.bottomNavigationService.setItems(this.navigationItems);
    this.bottomNavigationService.findActiveItem();
    this.bottomNavigationService.show();
  }
}
