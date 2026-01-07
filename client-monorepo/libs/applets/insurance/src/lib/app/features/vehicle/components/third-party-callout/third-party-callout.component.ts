import { Component, input } from '@angular/core';
import { IconEnum } from '../../../../data-access/enums/icon.enum';
import { BulletComponent } from './partials/bullet/bullet.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'third-party-callout',
  standalone: true,
  imports: [
    BulletComponent,
    NgClass
  ],
  templateUrl: './third-party-callout.component.html',
  styleUrl: './third-party-callout.component.scss'
})
export class ThirdPartyCalloutComponent {
  title = input<string>();
  items = input<string[]>([]);
  protected readonly IconEnum = IconEnum;
}
