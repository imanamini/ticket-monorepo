import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LANDING_ELEMENT_TYPE, LandingElement } from '../../../../api/clients/models/templates/c-bnpl/landing-element';
import { LandingElementTextSimpleItemsComponent } from './landing-element-text-simple-items/landing-element-text-simple-items.component';
import { LandingElementAlertBoxExtendedComponent } from './landing-element-alert-box-extended/landing-element-alert-box-extended.component';
import { LandingElementTextCardStepsComponent } from './landing-element-text-card-steps/landing-element-text-card-steps.component';
import { LandingElementTextCardComponent } from './landing-element-text-card/landing-element-text-card.component';
import { LandingElementAlertBoxComponent } from './landing-element-alert-box/landing-element-alert-box.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-landing-element',
  templateUrl: './landing-element.component.html',
  styleUrls: ['./landing-element.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    LandingElementAlertBoxComponent,
    LandingElementTextCardComponent,
    LandingElementTextCardStepsComponent,
    LandingElementAlertBoxExtendedComponent,
    LandingElementTextSimpleItemsComponent,
  ],
})
export class LandingElementComponent {
  @Input() element: LandingElement;
  @Output() showDialog = new EventEmitter<any>();

  BNPL_HELP_ELEMENT_TYPE = LANDING_ELEMENT_TYPE;

  convertToInt(text) {
    return parseInt(text);
  }

  showDialogById(event) {
    this.showDialog.emit(event);
  }
}
