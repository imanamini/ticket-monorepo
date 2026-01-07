import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  getSelectedCardProfile,
  saveSelectedCardProfile
} from '../utiles/storage';
import {CashOutService} from "./cash-out.service";
import { CardProfile } from '../models/card-profile-response.model';
import {MessageService} from "../../../core/services/message.service";

@Injectable()
export class CardService {
  private userCards = [];
  private cashOutService = inject(CashOutService);
  private selectedCardProfile: CardProfile;
  private messageService = inject(MessageService);

  getUserCards(): Promise<CardProfile[]> {
    return new Promise((resolve, reject) => {
      if (this.userCards?.length > 0) {
        resolve(this.userCards);
        return;
      }
      this.cashOutService.getCards()
        .pipe(map((result) => result.cards))
        .subscribe(
          (result: CardProfile[]) => {
            this.userCards = result;
            resolve(result);
          },
          (error) => {
            this.messageService.showErrorMessage(error?.error?.result?.message);
            reject(error);
          });
    });
  }

  getSelectedCardProfile(): CardProfile {
    if (this.selectedCardProfile) {
      return this.selectedCardProfile;
    }
    if (getSelectedCardProfile()) {
      const result: CardProfile = JSON.parse(getSelectedCardProfile());
      this.selectedCardProfile = result;
      return result;
    }
  }

  saveSelectedCardProfile(value: CardProfile) {
    this.selectedCardProfile = value;
    saveSelectedCardProfile(value);
  }

  public reset(): void {
    this.userCards = [];
    this.selectedCardProfile = null;
  }
}
