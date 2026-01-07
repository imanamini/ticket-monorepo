import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss']
})
export class BaseLayoutComponent implements OnInit {
  @Output() closeClicked = new EventEmitter();
  @Output() profileClicked = new EventEmitter();
  @Input() details: any;

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
