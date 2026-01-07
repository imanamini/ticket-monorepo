import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ColorService } from '../services/color.service';
import { CardProfile } from '../../../../api/digipay/models/card/card-profile-response.model';

@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.scss'],
  standalone: true,
})
export class BankCardComponent implements OnChanges {
  @Input() cardInfo: CardProfile;
  @Input() small = false;
  @Input() selectable = false;
  @Output() clicked = new EventEmitter<CardProfile>();
  @ViewChild('bankCard', { static: false }) bankCard: ElementRef<HTMLElement>;

  cardNumber = '';
  bg = '';

  constructor(private colorService: ColorService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cardInfo.currentValue !== changes.cardInfo.previousValue && changes.cardInfo) {
      this.cardNumber = this.cardInfo.prefix
        .split('')
        .splice(0, 4)
        .concat(' ')
        .concat(this.cardInfo.prefix.split('').splice(4, 2))
        .concat('** **** ')
        .concat(this.cardInfo.postfix)
        .join('');
      this.bg = this.colorService.getRGB(this.cardInfo.colorRange[0]);
    }
  }

  clickedEvent(): void {
    this.clicked.emit(this.cardInfo);
  }
}
