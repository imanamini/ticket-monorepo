import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@client-monorepo/common/utilities';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-unbundled-navigation-bar',
  templateUrl: './unbundled-navigation-bar.component.html',
  styleUrls: ['./unbundled-navigation-bar.component.scss'],
  standalone: true,
  imports: [NgFor]
})
export class UnbundledNavigationBarComponent implements OnInit {

  mobileSlideBar = false;

  navItems = [
    {
      title: 'جزییات',
      navigateTo: 'detail'
    },
    {
      title: 'موارد تحت پوشش',
      navigateTo: 'coverages'
    },
    {
      title: 'مزایا',
      navigateTo: 'advantages'
    },
    {
      title: 'مراحل',
      navigateTo: 'steps'
    },
    {
      title: 'سوالات متداول',
      navigateTo: 'faq'
    },
  ];

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
  }

  toggleMobileSlideBar(): void {
    this.mobileSlideBar = !this.mobileSlideBar;
  }

  navigate(id): void {
    const element = document.getElementById(id);
    if (!element) {
      this.messageService.showInfoMessage('این قسمت برای شما فعال نیست');
    } else {
      element?.scrollIntoView({behavior: 'smooth'});
    }
    this.mobileSlideBar = false;
  }

  handleProfileClick(): void {
    this.router.navigate(['dashboard/policy/list']).then();
  }
}
