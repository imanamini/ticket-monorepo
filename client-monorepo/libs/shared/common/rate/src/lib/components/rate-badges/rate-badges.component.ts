import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FramedIconComponent,
  FramedIconGradientModel,
  HorizontalScrollComponent,
} from '@client-monorepo/common/ui-components';
import { RateBadgeModel } from '../../data-access/models/rate-badge.model';
import { ServiceImagesType } from '@client-monorepo/common/service-data';

@Component({
  selector: 'common-rate-rate-badges',
  standalone: true,
  imports: [CommonModule, FramedIconComponent, HorizontalScrollComponent],
  templateUrl: './rate-badges.component.html',
  styleUrl: './rate-badges.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RateBadgesComponent {
  protected readonly ServiceImagesType = ServiceImagesType;
  iconStyles: { active: string; deActive: string } = { active: 'color: #0F53ED', deActive: 'color: #242E41' };
  badgesSelected = model<RateBadgeModel | undefined>(undefined);
  gradients: { [key: string]: FramedIconGradientModel } = {
    active: { start: { color: '#0F53ED', point: 11.43 }, end: { color: '#94BFFF', point: 92.87 }, degree: 224 },
    deActive: { start: { color: '#242E41', point: 11.43 }, end: { color: '#606C83', point: 92.87 }, degree: 224 },
  };
  cdr = inject(ChangeDetectorRef);
  badges: RateBadgeModel[] = [
    {
      icon: 'money',
      iconType: 'bold',
      title: 'خوش قیمت',
      active: false,
      style: this.iconStyles.deActive,
      gradient: this.gradients['deActive'],
    },
    {
      icon: 'friends',
      iconType: 'bold',
      title: 'مشتری مدار',
      active: false,
      style: this.iconStyles.deActive,
      gradient: this.gradients['deActive'],
    },
    {
      icon: 'arrow-2-up',
      iconType: 'bold',
      title: 'خوش قول',
      active: false,
      style: this.iconStyles.deActive,
      gradient: this.gradients['deActive'],
    },
    {
      icon: 'check-circle',
      iconType: 'bold',
      title: 'با کیفیت',
      active: false,
      style: this.iconStyles.deActive,
      gradient: this.gradients['deActive'],
    },
    {
      icon: 'emoji-happy-face',
      iconType: 'bold',
      title: 'کار درست',
      active: false,
      style: this.iconStyles.deActive,
      gradient: this.gradients['deActive'],
    },
    {
      icon: 'shopping-bag',
      iconType: 'bold',
      title: 'خرید راحت',
      active: false,
      style: this.iconStyles.deActive,
      gradient: this.gradients['deActive'],
    },
  ];

  constructor() {
    effect(() => {
      if (this.badgesSelected() === undefined) {
        this.resetBadges();
      }
    });
  }

  handleClick(index: number): void {
    const temp = this.badges;
    temp.forEach((badge) => {
      badge.active = false;
      badge.style = this.iconStyles.deActive;
      badge.gradient = this.gradients['deActive'];
    });
    temp[index] = {
      ...temp[index],
      active: true,
      style: this.iconStyles.active,
      gradient: this.gradients['active'],
    };
    this.badges = temp;
    this.emitSelected();
  }

  emitSelected(): void {
    const selected = this.badges.filter((badge) => badge.active)[0];
    this.badgesSelected.set(selected);
  }

  resetBadges(): void {
    this.badges.forEach((badge) => {
      badge.active = false;
      badge.style = this.iconStyles.deActive;
      badge.gradient = this.gradients['deActive'];
    });
    this.badges = [...this.badges];
    this.cdr.markForCheck();
  }
}
