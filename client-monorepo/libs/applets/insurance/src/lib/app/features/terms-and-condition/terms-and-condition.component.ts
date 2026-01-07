import { Component } from '@angular/core';
import { NgxIcon } from '@digipay/ngx-icon';
import { TERMS_DATA } from './data-access/terms-data';
import { MainHeaderComponent } from '../../components/main-header/main-header.component';
import { InsButtonComponent } from '../../components/ins-button/ins-button.component';
import { InsButtonSizeEnum } from '../../data-access/enums/ins-button-size.enum';
import { InsButtonModeEnum } from '../../data-access/enums/ins-button-mode.enum';
import { InsButtonStyleEnum } from '../../data-access/enums/ins-button-style.enum';

@Component({
  selector: 'terms-and-condition',
  standalone: true,
  imports: [
    NgxIcon,
    MainHeaderComponent,
    InsButtonComponent
  ],
  templateUrl: './terms-and-condition.component.html',
  styleUrl: './terms-and-condition.component.scss'
})
export class TermsAndConditionComponent {

  protected readonly TERMS_DATA = TERMS_DATA;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;

  backClicked(): void {
    window.history.back();
  }
}
