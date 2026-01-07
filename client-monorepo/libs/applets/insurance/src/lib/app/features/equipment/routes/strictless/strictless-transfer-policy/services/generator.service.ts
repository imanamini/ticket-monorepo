import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { TransferPolicyService } from './transfer-policy.service';
import { AuthService } from '../../../../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  hasProfile = false;

  constructor(private router: Router, private authService: AuthService,
              private transferPolicyService: TransferPolicyService) {
  }

  nextStepGenerator = function* () {
    yield 1;
    if (this.hasProfile) {
      this.getUserData();
      return;
    }
    yield 2;
    return 3;
  };

  private nextStep = this.nextStepGenerator();

  getUserData(): void {
    this.authService.userInfo().subscribe(res => {
      this.transferPolicyService.transferByCodeApi(res.data.identity);
    });
  }

  goToNextStep() {
    return this.nextStep.next();
  }

  setHasProfileState(hasProfile?: boolean): void {
    this.hasProfile = hasProfile;
  }

}
