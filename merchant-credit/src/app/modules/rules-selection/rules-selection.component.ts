import { Component, OnInit } from '@angular/core';
import { Rule } from './sandbox/models/rules-selection.model';
import { RulesSelectionService } from './sandbox/services/rules-selection.service';
import { RulesSelectionApiService } from '../../api/clients/rules-selection/rules-selection.api.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'rules',
  templateUrl: './rules-selection.component.html',
  styleUrls: ['./rules-selection.component.scss']
})
export class RulesSelectionComponent implements OnInit {
  rules: Rule[] = [];

  creditId: string = '';
  selectedRule: string = '';

  pendingApiCall = false;

  constructor(private rulesService: RulesSelectionService, private api: RulesSelectionApiService,
              private storage: StorageService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getRegistrationId();
    this.rulesService.rules.subscribe(rules => {
      if (!rules) {
        return;
      }
      this.rules = rules;
    });
  }

  getRegistrationId(): void {
    this.api.getRegistrationIdFromDetail().subscribe(res => {
      this.rulesService.registrationId.next(res.registrationId);
      this.rulesService.getRules();
    });
  }

  onRuleClick(rule: Rule): void {
    this.selectedRule = rule.uid;
  }

  assignRule(): void {
    if (this.pendingApiCall || !this.selectedRule) {
      return;
    }
    this.pendingApiCall = true;
    this.rulesService.assignRule(this.selectedRule).then(data => {
      this.creditId = data.creditId;
      this.pendingApiCall = false;
      this.router.navigate(['/registration-v2', this.creditId], {
        replaceUrl: true
      });
    }).catch(e => {
      this.pendingApiCall = false;
    });
  }

  onCloseClick() {
    window.history.back();
  }
}
