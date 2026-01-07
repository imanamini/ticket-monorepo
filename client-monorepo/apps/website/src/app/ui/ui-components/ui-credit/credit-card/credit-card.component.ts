import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { luminance } from '../../../../utils/colors';
import { Dir } from '@angular/cdk/bidi';
import { ApiImageModule } from '@digipay/ng-ui-api-image';
import { NgClass, NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
  standalone: true,
  imports: [NgClass, NgStyle, NgIf, ApiImageModule, Dir],
})
export class CreditCardComponent implements OnInit, OnChanges {
  @Input() color: string;
  @Input() logo: string;
  @Input() title: string;
  @Input() rightLabel: string;
  @Input() rightLabelBg: string;
  @Input() rightLabelIcon: string;
  @Input() leftLabel: string;
  @Input() leftLabelBg: string;
  @Input() leftLabelIcon: string;
  mode: 'dark' | 'light';

  ngOnInit(): void {
    this.setMode();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.color) {
      this.setMode();
    }
  }

  setMode() {
    this.mode = luminance(this.color) > 0.25 ? 'light' : 'dark';
  }
}
