import { Component, input } from '@angular/core';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { UserDetails } from '../../../data-access/models/user-details';
import {NgIf, NgOptimizedImage} from '@angular/common';
import { PipesModule } from '@digipay/ng-lib-pipes';

@Component({
  selector: 'cash-out-applet-account-owner-info',
  templateUrl: './ui-account-owner-info.component.html',
  styleUrls: ['./ui-account-owner-info.component.scss'],
  imports: [ApiImageModule, NgIf, PipesModule, NgOptimizedImage],
  standalone: true,
})
export class UiAccountOwnerInfoComponent{
  userDetail = input<UserDetails>();
}
