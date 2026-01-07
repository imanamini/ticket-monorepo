import { Component, input } from '@angular/core';
import { LoggedInUser } from '../../../../data-access/models/logged-in-user.model';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'user-detail-brief',
  standalone: true,
  imports: [
    NgxIcon
  ],
  templateUrl: './user-detail-brief.component.html',
  styleUrl: './user-detail-brief.component.scss'
})
export class UserDetailBriefComponent {
  userDetail = input.required<LoggedInUser>();
}
