import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { NgxIcon } from '@digipay/ngx-icon';
import { IconEnum } from '../../../../../../data-access/enums/icon.enum';
import { JourneyNamesModel } from '../../../../shared-steps/models/journey-names.model';

@Component({
  selector: 'renewal-header',
  templateUrl: './renewal-header.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgxIcon
  ],
  styleUrls: ['./renewal-header.component.scss']
})
export class RenewalHeaderComponent implements OnInit {

  constructor() {
  }

  readonly JourneyNamesModel = JourneyNamesModel;
  closeIconName = signal<IconEnum>(IconEnum.Back);

  @Input()
  showBackBtn: boolean;

  @Input()
  isMobile: boolean;

  @Input()
  journey: JourneyNamesModel;

  @Output()
  backClicked = new EventEmitter<any>();

  @Output()
  profileClicked = new EventEmitter<any>();

  ngOnInit(): void {
  }

  handleBackClick(event: any): void {
    this.backClicked.emit(event);
  }

  handleProfileClick(event: any): void {
    this.profileClicked.emit(event);
  }
}
