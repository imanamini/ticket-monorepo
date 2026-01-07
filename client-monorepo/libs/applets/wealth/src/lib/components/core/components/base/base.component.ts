import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  template: '',
})
export class BaseComponent implements OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();

  protected completeSubscriptions() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnDestroy(): void {
    this.completeSubscriptions();
  }

  get destroyObservable() {
    return this.destroy$.asObservable();
  }
}
