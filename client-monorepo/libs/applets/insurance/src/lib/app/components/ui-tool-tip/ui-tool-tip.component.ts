import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ui-tool-tip',
  templateUrl: './ui-tool-tip.component.html',
  styleUrls: ['./ui-tool-tip.component.scss'],
  standalone: true,
  imports: [NgIf, NgTemplateOutlet]
})
export class UiToolTipComponent implements OnInit {

  @Input()
  toolTip: TemplateRef<any>;

  @Input()
  show = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
