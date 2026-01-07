import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'flow-header',
  templateUrl: './flow-header.component.html',
  styleUrls: ['./flow-header.component.scss']
})
export class FlowHeaderComponent implements OnInit {

  @Input()
  heading!: string | undefined;

  @Input()
  headingNote!: string | undefined;

  @Input()
  details: {label: string, value: string}[] = [];

  @Input()
  hasBackButton: boolean = true;

  @Output()
  back = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
