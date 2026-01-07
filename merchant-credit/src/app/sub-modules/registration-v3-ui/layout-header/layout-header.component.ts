import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GetTicketDetailResponse } from '../../../api/clients/registration/response-models/get-ticket-detail.response';

@Component({
  selector: 'app-layout-header',
  templateUrl: './layout-header.component.html',
  styleUrls: ['./layout-header.component.scss']
})
export class LayoutHeaderComponent implements OnInit {

  @Output() closeClicked = new EventEmitter();
  @Output() profileClicked = new EventEmitter();
  @Input() details!: GetTicketDetailResponse;

  constructor() {
  }

  ngOnInit(): void {
  }

  closeClick() {
    this.closeClicked.emit();
  }

  profileClick() {
    this.profileClicked.emit();
  }
}
