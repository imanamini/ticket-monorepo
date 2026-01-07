import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Rule } from '../../../api/models/registration/rules/rules.response';

@Component({
  selector: 'ui-rule-card',
  templateUrl: './rule-card.component.html',
  styleUrls: ['./rule-card.component.scss']
})
export class RuleCardComponent implements OnInit, OnChanges {

  @Input()
  selected = false;

  @Input()
  rule!: Rule;

  @Output()
  cardClicked = new EventEmitter<Rule>();

  details: { label: string, value: any }[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rule && changes.rule.currentValue) {
      this.details = this.rule.ruleDetails;
    }
  }

  onCardClick() {
    this.cardClicked.emit(this.rule);
  }
}
