import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { PageLayoutComponent } from '@client-monorepo/common/ui-components';

@Component({
  selector: 'profile-applet-about-us',
  standalone: true,
  imports: [CommonModule, DpIconComponent, PageLayoutComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutUsComponent {
  socialLinks = [
    {
      icon: 'Instagram',
      link: 'https://www.instagram.com/mydigipay/',
    },
    {
      icon: 'Home',
      link: 'https://www.mydigipay.com/',
    },
    {
      icon: 'Call',
      link: 'tel:02153924000',
    },
  ];
}
