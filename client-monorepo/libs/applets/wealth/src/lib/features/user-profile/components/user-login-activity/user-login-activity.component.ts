import { Component, Input } from '@angular/core';
import { UserLoginActivityModel } from '../../models/user-login-activity.model';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { KeyValue, KeyValuePipe, NgClass } from '@angular/common';

import { JalaliTimePipe } from '../../../../shared/pipes/jalali-time.pipe';

@Component({
  selector: 'app-user-login-activity',
  standalone: true,
  imports: [PipesModule, JalaliTimePipe, KeyValuePipe, NgClass],
  templateUrl: './user-login-activity.component.html',
  styleUrl: './user-login-activity.component.scss',
})
export class UserLoginActivityComponent {
  @Input() logs: UserLoginActivityModel[];
  @Input() noCard = false;

  sortByIPAddressKey(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
    if (a.key === 'ipAddress' || b.key === 'ipAddress') return -1;
    return a.key.localeCompare(b.key);
  }
}
