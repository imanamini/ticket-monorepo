import { inject, Injectable, signal } from '@angular/core';
import { DpxService } from './dpx.service';
import { ReferrerService } from './referrer.service';
import { InsDigikalaService } from './ins-digikala.service';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private digikalaService = inject(InsDigikalaService);
  public dpxService = inject(DpxService);
  public referrerService = inject(ReferrerService);

  public isShowHeader = signal<boolean>(!this.digikalaService.isDigikalaSuperApp && this.dpxService.IsEnteredFromDpx);
}
