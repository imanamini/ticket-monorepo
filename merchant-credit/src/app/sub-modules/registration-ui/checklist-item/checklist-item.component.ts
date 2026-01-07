import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'checklist-item',
  templateUrl: './checklist-item.component.html',
  styleUrls: ['./checklist-item.component.scss']
})
export class ChecklistItemComponent implements OnInit {

  @Input()
  itemTitle!: string;

  @Input()
  checked = false;

  @Input()
  subtitle = '';

  @Input()
  tags: string[] = [];

  @Output()
  clicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onClick() {
    this.clicked.emit();
  }

}
