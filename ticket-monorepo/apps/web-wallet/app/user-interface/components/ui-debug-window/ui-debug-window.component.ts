import { Component, OnInit } from '@angular/core';
import { DebugWindowService } from './debug-window.service';
import Clipboard from '../../../utils/clipboard';

@Component({
  selector: 'ui-debug-window',
  templateUrl: './ui-debug-window.component.html',
  styleUrls: ['./ui-debug-window.component.scss']
})
export class UiDebugWindowComponent implements OnInit {

  text = '';

  constructor(
    private service: DebugWindowService,
  ) {
  }

  ngOnInit() {
    this.service.logs.asObservable().subscribe(log => {
      this.text += '<p>' + log + '<p>\n';
    });
  }

  copy() {
    Clipboard.copy(this.text);
  }
}
