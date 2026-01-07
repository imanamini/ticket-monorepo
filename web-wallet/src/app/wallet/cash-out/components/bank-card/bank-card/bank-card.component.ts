import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ColorService } from '../services/color.service';
import {NgStyle} from "@angular/common";
import {CardProfile} from "../../../models/card-profile-response.model";
import {UserInterfaceModule} from "../../../../../user-interface/user-interface.module";

@Component({
  selector: 'bank-card',
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.scss'],
  imports: [
    NgStyle,
    UserInterfaceModule
  ],
  standalone: true
})
export class BankCardComponent implements OnInit, OnChanges {
  @Input() cardInfo: CardProfile;
  @Input() small = false;
  @Input() selectable = false;
  @Output() clicked = new EventEmitter<CardProfile>();
  @ViewChild('bankCard', {static: false}) bankCard: ElementRef<HTMLElement>;

  cardNumber = '';
  bg = '';

  constructor(
    private colorService: ColorService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cardInfo.currentValue !== changes.cardInfo.previousValue && changes.cardInfo) {
      const splitCardNumber = this.cardInfo.pan.match(/.{1,4}/g);
      this.cardNumber = splitCardNumber.join(' ');
      this.bg = this.colorService.getRGB(this.cardInfo.colorRange[0]);
    }
  }

  ngOnInit(): void {
  }

  clickedEvent(): void {
    this.clicked.emit(this.cardInfo);
  }
}
