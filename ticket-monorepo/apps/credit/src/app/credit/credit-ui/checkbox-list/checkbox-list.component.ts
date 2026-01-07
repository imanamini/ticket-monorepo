import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UiOption } from '../models/ui-option.model';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent implements OnInit {

  @Input()
  checkboxes: UiOption[] = [];

  @Input()
  checked: {
    [key: string]: boolean
  } = {};

  @Output()
  changed = new EventEmitter<object>();

  imageLoadErrors = {};

  constructor() {
  }

  ngOnInit() {
  }

  itemClick(option: UiOption) {
    if (!this.checked.hasOwnProperty(option.value)) {
      this.checked[option.value] = true;
    } else {
      this.checked[option.value] = !this.checked[option.value];
    }

    this.changed.emit(this.checked);
  }


  imageLoadError(imageId) {
    this.imageLoadErrors[imageId] = true;
  }

}
