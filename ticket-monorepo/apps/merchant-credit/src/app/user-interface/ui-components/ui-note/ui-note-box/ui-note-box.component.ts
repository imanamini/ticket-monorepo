import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ui-note-box',
  templateUrl: './ui-note-box.component.html',
  styleUrls: ['./ui-note-box.component.scss']
})
export class UiNoteBoxComponent implements OnInit {

  @Input()
  noteTitle!: string;

  @Input()
  note!: string;

  @Input()
  actionText!: string;

  @Input()
  points: string[] = [];

  @Output()
  actionClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onActionClick(): void {

  }
}
