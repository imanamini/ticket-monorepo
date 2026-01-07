import { Component } from '@angular/core';
import { InsButtonComponent } from '../../../../../../components/ins-button/ins-button.component';
import { InsButtonModeEnum } from '../../../../../../data-access/enums/ins-button-mode.enum';
import { InsButtonStyleEnum } from '../../../../../../data-access/enums/ins-button-style.enum';
import { InsButtonSizeEnum } from '../../../../../../data-access/enums/ins-button-size.enum';

@Component({
  selector: 'call-to-support-home',
  standalone: true,
  imports: [
    InsButtonComponent
  ],
  templateUrl: './call-to-support-home.component.html',
  styleUrl: './call-to-support-home.component.scss'
})
export class CallToSupportHomeComponent {

  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;

  protected callToSupport(): void{
    window.open('tel:02153924000');
  }
}
