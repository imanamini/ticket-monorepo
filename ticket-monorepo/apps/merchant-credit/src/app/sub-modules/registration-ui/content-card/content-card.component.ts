import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ui-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent implements OnInit {

  @Input()
  cardTitle!: string;

  @Input()
  contentPadding = true;

  @Input()
  bottomPadding = true;

  @Input()
  backArrow = false;

  @Input()
  close = false;

  @Input()
  help = false;

  @Output()
  backClicked = new EventEmitter();

  @Output()
  helpClicked = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  onBackClick(): void {
    this.backClicked.emit();
  }

  onHelpClick(): void {
    this.helpClicked.emit();
  }

}
