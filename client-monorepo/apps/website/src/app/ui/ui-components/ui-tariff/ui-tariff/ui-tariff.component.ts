import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-ui-tariff',
  templateUrl: './ui-tariff.component.html',
  styleUrls: ['./ui-tariff.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class UiTariffComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  input: InputTariff[] = [];

  @Input()
  description = '';

  @Input()
  notice = '';
}

export interface InputTariff {
  key: string;
  value: string;
}
