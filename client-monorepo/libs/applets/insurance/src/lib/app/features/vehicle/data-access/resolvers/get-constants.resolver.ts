import { MaybeAsync, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ConstantAllService } from '../services/shared/constant-all.service';

@Injectable({
  providedIn: 'root'
})
export class GetConstantResolver implements Resolve<any> {
  constructor(private constantAllServices: ConstantAllService) {
  }

  resolve(): MaybeAsync<any> {
    try {
      return this.constantAllServices.getConstantsVariables();
    } catch (e) {
      return null;
    }
  }
}
