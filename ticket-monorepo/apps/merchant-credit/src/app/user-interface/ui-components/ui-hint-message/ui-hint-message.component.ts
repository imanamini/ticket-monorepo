import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ui-hint-message',
  templateUrl: './ui-hint-message.component.html',
  styleUrls: ['./ui-hint-message.component.scss']
})
export class UiHintMessageComponent implements OnInit {

  @Input() message: string = '';

  @Input() ctaButton?: string;

  @Output() ctaClick = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onCtaClick() {
    this.ctaClick.emit();
  }
}
