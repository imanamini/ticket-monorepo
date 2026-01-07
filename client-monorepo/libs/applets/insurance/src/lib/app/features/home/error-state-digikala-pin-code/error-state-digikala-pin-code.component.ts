import { Component, inject, signal } from '@angular/core';
import { NgxIllustrationIcon } from '@digipay/ngx-illustration-icon';
import { NgxAlert } from '@digipay/ngx-alert';
import { InsButtonModeEnum } from '../../../data-access/enums/ins-button-mode.enum';
import { InsButtonSizeEnum } from '../../../data-access/enums/ins-button-size.enum';
import { InsButtonStyleEnum } from '../../../data-access/enums/ins-button-style.enum';
import { NgxIcon } from '@digipay/ngx-icon';
import { IconEnum } from '../../../data-access/enums/icon.enum';
import { InsDigikalaService } from '../../../data-access/services/ins-digikala.service';

@Component({
  selector: 'error-state-digikala-pin-code',
  standalone: true,
  imports: [NgxIllustrationIcon, NgxAlert, NgxIcon],
  templateUrl: './error-state-digikala-pin-code.component.html',
  styleUrl: './error-state-digikala-pin-code.component.scss',
})
export class ErrorStateDigikalaPinCodeComponent {
  protected readonly InsButtonModeEnum = InsButtonModeEnum;
  protected readonly InsButtonSizeEnum = InsButtonSizeEnum;
  protected readonly InsButtonStyleEnum = InsButtonStyleEnum;
  protected readonly IconEnum = IconEnum;

  private readonly digikalaSuperWebService = inject(InsDigikalaService);

  protected isSuperWeb = signal<boolean>(this.digikalaSuperWebService.webDigikala.isDgkSuperWebUser);

  protected goToDigikala(): void {
    window.open('https://www.digikala.com/', '_blank');
  }
}
