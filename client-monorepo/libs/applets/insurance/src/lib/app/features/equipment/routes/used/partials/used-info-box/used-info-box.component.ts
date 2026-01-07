import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UiIconComponent } from '../../../../../../data-access/directives/ui-icon/ui-icon.component';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'used-info-box',
  templateUrl: './used-info-box.component.html',
  standalone: true,
  imports: [
    UiIconComponent,
    NgxIcon
  ],
  styleUrls: ['./used-info-box.component.scss']
})
export class UsedInfoBoxComponent implements OnInit {

  constructor() {
  }

  @Input()
  footerText: string;

  @Input()
  showFooter: boolean;

  @Input()
  bodyText: string;

  @Output()
  footerClicked = new EventEmitter<any>();

  ngOnInit(): void {
  }

  handleFooterClick(event: Event): void {
    this.footerClicked.emit(event);
  }
}
