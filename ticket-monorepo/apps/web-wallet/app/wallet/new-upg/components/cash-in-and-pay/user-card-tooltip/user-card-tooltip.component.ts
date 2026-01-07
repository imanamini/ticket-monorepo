import {Component, inject, Input, OnInit} from '@angular/core';
import {UserCardHintTooltipService} from "./user-card-hint-tooltip.service";
import {TgsSelectFeatureResponse} from "../../../../../api/models/tgs-select-feature-response";
import {SeparatorPipe} from "../../../../../user-interface/pipes/amount-separator.pipe";

@Component({
  selector: 'app-user-card-tooltip',
  templateUrl: './user-card-tooltip.component.html',
  styleUrls: ['./user-card-tooltip.component.scss'],
  providers:[SeparatorPipe]
})
export class UserCardTooltipComponent implements OnInit {
  @Input() info: TgsSelectFeatureResponse;
  public userCardHintTooltipService = inject(UserCardHintTooltipService);
  public userCardHintText: string = '';
  private separator = inject(SeparatorPipe);

  ngOnInit() {
    this.userCardHintText = this.userCardHintTooltipService.createText(this.info , this.separator);
  }

}
