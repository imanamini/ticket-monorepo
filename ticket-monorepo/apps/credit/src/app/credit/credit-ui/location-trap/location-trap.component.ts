import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LocationTrap } from './location-trap';

@Component({
  selector: 'app-location-trap',
  template: ''
})
export class LocationTrapComponent extends LocationTrap implements OnInit, OnChanges {

  @Input() canExit: boolean;
  @Input() canBack: boolean;

  @Output() exit = new EventEmitter();
  @Output() back = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit() {
    this.setProps();
    this.exitTrap.subscribe(() => {
      this.exit.emit();
    });

    this.backTrap.subscribe(() => {
      this.back.emit();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.canExit || changes.canBack) {
      this.setProps();
    }
  }

  setProps() {
    this.canExitTrap = this.canExit;
    this.canBackTrap = this.canBack;
  }

}
