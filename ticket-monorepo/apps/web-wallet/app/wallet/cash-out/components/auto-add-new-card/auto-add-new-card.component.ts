import { Component } from '@angular/core';
import { PATH } from '../../consts/cash-out-paths.const';
import { AddNewCardComponent } from '../add-new-card/add-new-card.component';
import {CardNumberPipe} from "@digipay/ng-lib-pipes";

@Component({
  selector: 'auto-add-new-card',
  templateUrl: './auto-add-new-card.component.html',
  styleUrls: ['./auto-add-new-card.component.scss'],
  providers: [CardNumberPipe]
})
export class AutoAddNewCardComponent extends AddNewCardComponent {
  readonly PATH = PATH;
}
