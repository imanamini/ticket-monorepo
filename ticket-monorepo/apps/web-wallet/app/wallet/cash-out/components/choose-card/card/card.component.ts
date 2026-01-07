import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CardService } from '../../../services/card.service';
import { CashOutProcessService } from '../../../services/cash-out-process.service';
import { saveCardInfoEnteredByUser } from '../../../utiles/storage';
import {ActivatedRoute, Router} from '@angular/router';
import { PATH } from '../../../consts/cash-out-paths.const';
import {CardProfile} from "../../../models/card-profile-response.model";
import {PanTypeEnum} from "../../../models/pan-type.enum";

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  public selectedCard: CardProfile = null;
  @Output() submit: EventEmitter<CardProfile> = new EventEmitter<CardProfile>();

  public isLoading = false;
  public errorGetConfig = '';
  public cards: CardProfile[] = [];
  public selectedUserAmount: number;
  private cardService = inject(CardService);
  private registerCashOutService = inject(CashOutProcessService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute)

  public saveCard(card: CardProfile): void {
    saveCardInfoEnteredByUser({
      sourceCardNumber: card.pan,
      expireDate: card.expireDate,
      value: card.cardIndex,
      type: PanTypeEnum.INDEX,
      prefix: card.prefix,
      postfix: card.postfix
    });
    this.cardService.saveSelectedCardProfile(card);
  }

  ngOnInit(): void {
    this.selectedUserAmount = this.registerCashOutService.getSelectedUserAmount();
    this.cardService.getUserCards()
      .then((result: CardProfile[]) => {
        if (result.length < 1) {
          this.router.navigate(['../'+ PATH.autoAddCard], { relativeTo: this.activatedRoute });
        } else {
          this.cards = result;
          this.saveCard(this.cards[0]);
        }
      }).catch(() => {
      this.errorGetConfig = 'عملیات با خطا مواجه شد لطفا بعدا مجددا تلاش کنید.';
    });
  }
}
