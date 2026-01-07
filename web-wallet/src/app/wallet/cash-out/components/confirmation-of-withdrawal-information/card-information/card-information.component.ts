import { Component, inject, OnInit } from '@angular/core';
import { getCardInfoEnteredByUser } from '../../../utiles/storage';
import { CardService } from '../../../services/card.service';
import { CashOutProcessService } from '../../../services/cash-out-process.service';
import { CardInfoEnteredByUserInterface } from '../../../models/card-info-entered-by-user.interface';
import {CardProfile} from "../../../models/card-profile-response.model";

@Component({
  selector: 'card-information',
  templateUrl: './card-information.component.html',
  styleUrls: ['./card-information.component.scss']
})
export class CardInformationComponent implements OnInit {
  public selectedCard: CardProfile;
  public userCardInformation: CardInfoEnteredByUserInterface;
  public amount: number;
  private cardService = inject(CardService);
  private registerCashOutService = inject(CashOutProcessService);

  ngOnInit() {
    this.getSelectedCard();
    this.getUserCardInformation();
    this.getAmount();
  }

  private getSelectedCard(): void {
    this.selectedCard = this.cardService.getSelectedCardProfile();
  }

  private getUserCardInformation(): void {
    this.userCardInformation = JSON.parse(getCardInfoEnteredByUser());
  }

  private getAmount() {
    this.amount = this.registerCashOutService.getSelectedUserAmount();
  }
}
