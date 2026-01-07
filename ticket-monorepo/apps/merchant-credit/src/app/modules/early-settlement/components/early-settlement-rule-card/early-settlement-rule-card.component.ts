import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { EarlySettlementRule } from '../../../../api/clients/early-settlement/basic-models/early-settlement-rules';

@Component({
  selector: 'app-early-settlement-rule-card',
  templateUrl: './early-settlement-rule-card.component.html',
  styleUrls: ['./early-settlement-rule-card.component.scss']
})
export class EarlySettlementRuleCardComponent implements OnInit {

  @Input()
  selected = false;

  @Input()
  rule!: EarlySettlementRule;

  @Output()
  cardClicked = new EventEmitter<EarlySettlementRule>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rule && changes.rule.currentValue) {
    }
  }

  onCardClick() {
    if (this.rule.enabled && this.rule.visible) {
      this.cardClicked.emit(this.rule);
    }
  }

}
