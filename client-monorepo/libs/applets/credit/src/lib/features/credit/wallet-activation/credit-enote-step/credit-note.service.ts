import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CreditUrlService } from '../../data-access/utils/url';
import { NoteTypes } from '../../data-access/models/credit/activation/enote-step/enote-types.enum';

@Injectable({
  providedIn: 'root',
})
export class CreditNoteService {
  constructor(
    private router: Router,
    private creditUrlService: CreditUrlService,
  ) {}

  closeStep(fundProviderCode: number, creditId: string) {
    this.router.navigateByUrl(this.creditUrlService.getInnerServicePath(`/wallet/activation/steps/${fundProviderCode}/${creditId}`));
  }

  resolve(fundProviderCode: number, creditId: string) {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/resolve/${fundProviderCode}/${creditId}`),
    );
  }

  goNotePage(fundProviderCode: number, creditId: string, collateralType: NoteTypes) {
    const noteType = collateralType.toLowerCase();
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/${noteType}/${fundProviderCode}/${creditId}`),
    );
  }

  goSelectPage(fundProviderCode: number, creditId: string) {
    this.router.navigateByUrl(
      this.creditUrlService.getInnerServicePath(`/wallet/activation/enote/select-note/${fundProviderCode}/${creditId}`),
    );
  }
}
