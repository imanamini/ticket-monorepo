import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { UiButtonComponent } from '../../../../components/ui-button/ui-button/ui-button.component';
import { isDesktop, isMobileOrTablet } from '@client-monorepo/common/utilities';

@Component({
  selector: 'journey-buttons',
  templateUrl: './journey-buttons.component.html',
  standalone: true,
  imports: [NgClass, NgIf, UiButtonComponent],
  styleUrls: ['./journey-buttons.component.scss'],
})
export class JourneyButtonsComponent implements OnInit {
  constructor() {}

  // Inputs
  @Input()
  backText: string;

  // Inputs
  @Input()
  idValue: string;

  @Input()
  nextText: string;

  @Input()
  disableNext: boolean;

  @Input()
  disableBack: boolean;

  @Input()
  showExtra: boolean;

  @Input()
  extraLabel: string;

  @Input()
  extraContent: string;

  @Input()
  hideBackBtn: boolean;

  @Input()
  hideBackBtnIcon: boolean;

  @Input()
  hideNextBtn: boolean;

  @Input()
  isReversed = true;

  @Input()
  hasBorder: boolean;

  // Outputs
  @Output()
  backClicked: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  nextClicked: EventEmitter<any> = new EventEmitter<any>();

  // Vars
  isMobile = isMobileOrTablet() || !isDesktop();

  ngOnInit(): void {}

  handleClick(event: any, mode: 'NEXT' | 'PREVIOUS'): void {
    if (mode === 'NEXT') {
      this.nextClicked.emit(event);
    } else {
      this.backClicked.emit(event);
    }
  }
}
