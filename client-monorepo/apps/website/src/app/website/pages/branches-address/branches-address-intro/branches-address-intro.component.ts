import {Component, Inject, input, Input, OnInit, PLATFORM_ID} from '@angular/core';

import {UiButtonComponent} from '../../../../ui/ui-components/ui-button/ui-button/ui-button.component';
import {NgFor} from '@angular/common';
import {NgxIcon} from "@digipay/ngx-icon";
import {UiIconDirective} from "../../../../ui/ui-directive/ui-icon.directive";
import {
  sectionAddress
} from "../../../../api/clients/models/templates/branches-address/branches-address-template-data";

declare let ol: any;

@Component({
  selector: 'app-branches-address-intro',
  templateUrl: './branches-address-intro.component.html',
  styleUrls: ['./branches-address-intro.component.scss'],
  standalone: true,
  imports: [NgFor, UiButtonComponent, NgxIcon, UiIconDirective],
})
export class BranchesAddressIntroComponent {
  data = input<sectionAddress>();
  selectedTab = 0;

}
