import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  template: ''
})
export abstract class StepBase {
  @Output()
  nextStep = new EventEmitter();
}
