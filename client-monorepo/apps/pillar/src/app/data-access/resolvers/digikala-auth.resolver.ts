import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DigikalaAuthStateService } from '../services/digikala-auth-state.service';

export const digikalaAuthResolver: ResolveFn<boolean> = async () => {
  const authStateService = inject(DigikalaAuthStateService);

  return authStateService.resolveStatus();
};
