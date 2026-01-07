import { inject, Inject, Injectable } from '@angular/core';
import { AuthDigikalaService, DigikalaService, DigikalaSuperWebService } from '@client-monorepo/pillar/digikala';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsDigikalaService extends DigikalaService {
  private showErrorStateDgkPinCodeSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public showErrorStateDgkPinCode$: Observable<boolean> = this.showErrorStateDgkPinCodeSource.asObservable();

  public readonly authDigikalaService = inject(AuthDigikalaService);
  public readonly webDigikala = inject(DigikalaSuperWebService);
  constructor(@Inject('APP_ENV') environment: { [key: string]: string }) {
    super(environment);
  }

  public checkHasErrorIdpPinCode(error: any): boolean {
    const status = error?.status === 401 && (error.error?.result?.status === 2001 || error.error?.result?.status === 2002);
    this.showErrorStateDgkPinCodeSource.next(status);
    return status;
  }
}
