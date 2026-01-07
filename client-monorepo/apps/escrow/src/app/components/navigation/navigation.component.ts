import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationItemInterface } from '../../data-access/models/navigation-item.interface';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DpIconComponent } from '@client-monorepo/common/icon';

@Component({
  selector: 'escrow-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, DpIconComponent],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent implements OnInit {
  expanded = input<boolean>(true);
  toggle = output<void>();

  navigationItems: Array<NavigationItemInterface> = [
    {
      text: 'خانه',
      icon: 'Home',
      link: '/',
      isActive: true,
    },
    {
      text: 'سفارش ها',
      icon: 'Home',
      link: '/stores',
      isActive: true,
    },
    {
      text: 'پروفایل',
      icon: 'Group',
      link: '/profile',
    },
  ];
  activeNavigationItem: NavigationItemInterface | undefined;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.detectActiveMenuItem();
  }

  navigate(menuItem: NavigationItemInterface): void {
    this.changeActiveItem(menuItem);

    this.router.navigate([menuItem.link]).then(() => {
      this.activeNavigationItem = menuItem;
      if (
        (!this.expanded() && this.activeNavigationItem.subMenus?.length) ||
        (this.expanded() && !this.activeNavigationItem.subMenus?.length)
      ) {
        this.toggle.emit();
      }
    });
  }

  changeActiveItem(menuItem: NavigationItemInterface): void {
    const prevItem = this.navigationItems.find((i) => i.isActive);
    if (prevItem) {
      prevItem.isActive = false;
    }
    menuItem.isActive = true;
  }

  detectActiveMenuItem(): void {
    if (!this.activeNavigationItem) {
      this.activeRoute.firstChild?.url.subscribe({
        next: (value) => {
          const route = value.toString();
          this.navigationItems.forEach((item) => {
            if (item.link == '/' + route) {
              this.activeNavigationItem = item;
              return;
            }
          });
        },
      });
    }
  }
}
