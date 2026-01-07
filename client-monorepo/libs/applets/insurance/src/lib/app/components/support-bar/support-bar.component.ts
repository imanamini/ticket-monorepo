import { Component, Input } from '@angular/core';
import { NgButtonModule } from '@digipay/ng-button';
import { AppWindow } from '../../data-access/web-interfaces/app-window';
import { NgClass } from '@angular/common';

declare const window: AppWindow;

@Component({
  selector: 'support-bar',
  standalone: true,
  imports: [
    NgButtonModule,
    NgClass
  ],
  templateUrl: './support-bar.component.html',
  styleUrl: './support-bar.component.scss'
})

export class SupportBarComponent {

  @Input({required: true}) phoneCall: string;
  @Input({required: true}) title: string;
  @Input({required: true}) subTitle: string;
  @Input() isMobile: boolean;

  makeCall(): void {
    window.location.href = 'tel:' + encodeURIComponent(this.phoneCall);
  }
}
