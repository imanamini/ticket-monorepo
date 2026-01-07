import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterOptions } from '../filters/filters';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  template: '',
  standalone: true,
})
export class MerchantsFilterComponent {
  @Input() title: string;

  @Input() selectedFilters: FilterOptions;

  @Output() changeFilterEmitter = new EventEmitter();

  subscriptions: Subscription[] = [];

  form: FormGroup;

  constructor(public fb: FormBuilder) {}

  ngOnDestroy(): void {
    this.deleteSubscriptions();
  }

  deleteSubscriptions() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
