import { Component, Input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'ui-detail-list',
  templateUrl: './ui-detail-list.component.html',
  styleUrls: ['./ui-detail-list.component.scss'],
  standalone: true,
  imports: [NgFor]
})
export class UiDetailListComponent implements OnInit {

  @Input()
  itemsList: { title: string, value: string }[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
