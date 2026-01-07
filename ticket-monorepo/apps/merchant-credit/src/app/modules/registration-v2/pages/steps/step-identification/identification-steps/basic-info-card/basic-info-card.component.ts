import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Rule } from '../../../../../../../api/models/registration/rules/rules.response';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-basic-info-card',
  templateUrl: './basic-info-card.component.html',
  styleUrls: ['./basic-info-card.component.scss']
})
export class BasicInfoCardComponent implements OnInit {

  @Input()
  selected = false;

  @Input()
  basicInfo!: any;

  @Input()
  form!: UntypedFormGroup;

  @Output()
  cardClicked = new EventEmitter<Rule>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onCardClick() {
    this.cardClicked.emit(this.basicInfo);
  }

}
