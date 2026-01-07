import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RulesSelectionApiService } from '../../../../api/clients/rules-selection/rules-selection.api.service';
import { Rule } from '../models/rules-selection.model';

@Injectable({
  providedIn: 'root'
})
export class RulesSelectionService {
  registrationId: BehaviorSubject<string> = new BehaviorSubject('');
  rules: BehaviorSubject<Rule[]> = new BehaviorSubject<Rule[]>([]);

  constructor(private api: RulesSelectionApiService) {
  }

  getRules(): void {
    const registrationId = this.registrationId.getValue();
    if (!registrationId) {
      return;
    }
    this.api.getRules(registrationId).subscribe(res => {
      this.rules.next(res.rules);
    }, error => {
      console.log('Error', error);
      // this.messageService.showErrorIfExists(e);
    });
  }

  assignRule(ruleId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const registrationId = this.registrationId.getValue();

      if (!registrationId) {
        reject('details subject is empty');
        return;
      }
      this.api.assignRule(registrationId, ruleId).subscribe(res => {
        resolve(res);
      }, (e: any) => {
        reject(e);
      });
    });
  }

}
