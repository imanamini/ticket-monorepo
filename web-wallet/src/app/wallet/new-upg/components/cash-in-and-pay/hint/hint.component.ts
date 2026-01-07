import {Component, Input} from '@angular/core';
import * as Sentry from "@sentry/angular-ivy";
import {TgsSelectFeatureResponse} from "../../../../../api/models/tgs-select-feature-response";
@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss']
})
export class HintComponent {
  @Input()
  info: TgsSelectFeatureResponse;
  constructor() {
    Sentry.setTag('module', 'UPG-Front-Module')
  }
}
