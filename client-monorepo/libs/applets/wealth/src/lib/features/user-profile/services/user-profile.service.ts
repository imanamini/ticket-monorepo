import { Injectable } from '@angular/core';
import { IManageProfile } from '../models/manage-profile.interface';
import { EXPIRED_PASSWORD_ROUTE, TERMS_AND_CONDITIONS_ROUTE, USER_LOGIN_ACTIVITIES_ROUTE } from '../../../data-access/constants/app-routes';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'platform',
})
export class UserProfileService {
  private timerSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  stopTimer = this.timerSubject.asObservable();

  private static managmentItems: IManageProfile[] = [
    {
      active: true,
      icon: 'wealth-assets/svg/logs-icon.svg',
      iconName: '',
      route: USER_LOGIN_ACTIVITIES_ROUTE,
      title: 'گزارش ورود و خروج',
      id: 'LOGS',
    },
    {
      active: true,
      icon: 'wealth-assets/svg/terms-icon.svg',
      iconName: '',
      route: TERMS_AND_CONDITIONS_ROUTE,
      title: 'قوانین و مقررات',
      id: 'TERMS_AND_CONDITIONS',
    },
    {
      active: true,
      icon: 'wealth-assets/svg/change-password-icon.svg',
      iconName: 'lock',
      route: EXPIRED_PASSWORD_ROUTE,
      title: 'تغییر رمز عبور',
      id: 'CHANGE_PASSWORD',
    },
    {
      active: true,
      icon: 'wealth-assets/svg/change-phone-icon.svg',
      iconName: '',
      route: null,
      title: 'ویرایش شماره موبایل',
      id: 'CHANGE_PHONE_NUMBER',
    },
  ];

  getManagmentItems(titles?: managmentTitles[]): IManageProfile[] {
    return UserProfileService.managmentItems.filter((item) => titles.toString().includes(item.id));
  }

  clearTimer(timer: number) {
    const intt = setTimeout(() => {
      if (timer <= 0) {
        localStorage.removeItem('LIMIT_TIME');
        clearTimeout(intt);
      } else {
        timer--;
      }
    }, 1000);
  }
}

export type managmentTitles = 'LOGS' | 'CHANGE_PASSWORD' | 'CHANGE_PHONE_NUMBER' | 'TERMS_AND_CONDITIONS';
