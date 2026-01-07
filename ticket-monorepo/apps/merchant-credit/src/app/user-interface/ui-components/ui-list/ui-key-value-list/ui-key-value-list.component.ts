import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-key-value-list',
  templateUrl: './ui-key-value-list.component.html',
  styleUrls: ['./ui-key-value-list.component.scss']
})
export class UiKeyValueListComponent implements OnInit {

  @Input()
  items: { label: string, value: any }[] = [];

  @Input()
  separated = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
