import { NgxBadgeModule } from '@digipay/ngx-badge';
import { Component, computed, input } from '@angular/core';
import { UserInfoModel } from '../../models/user-info.model';

@Component({
  selector: 'app-user-info-card',
  standalone: true,
  imports: [NgxBadgeModule],
  templateUrl: './user-info-card.component.html',
  styleUrl: './user-info-card.component.scss',
})
export class UserInfoCardComponent {
  user = input.required<UserInfoModel>();

  sejamState = computed(() => {
    switch (this.user().isSejami) {
      case true:
        return 'دارای سجام';
      case false:
        return 'فاقد سجام';
      default:
        return 'سجام نامشخص';
    }
  });
}
