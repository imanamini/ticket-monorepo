import { Component, Input } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { PipesModule } from '@digipay/ng-lib-pipes';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-pre-registration-group-detail-toggles',
  templateUrl: './pre-registration-group-detail-toggles.component.html',
  styleUrls: ['./pre-registration-group-detail-toggles.component.scss'],
  animations: [
    trigger('description', [
      transition('void => in', [style({height: '0px'}), animate(300, style({height: '*'}))]),
      transition('in => void', [style({height: '*'}), animate(300, style({height: '0px'}))]),
    ]),
  ],
  standalone: true,
  imports: [NgIf, NgClass, PipesModule],
})
export class PreRegistrationGroupDetailTogglesComponent {
  @Input() title: string;
  @Input() value: string;
  @Input() description: string;
  @Input() openMode: boolean;

  toggled: boolean;

  constructor() {
    this.toggled = false;
  }

  toggle(): void {
    this.toggled = !this.toggled;
  }
}
