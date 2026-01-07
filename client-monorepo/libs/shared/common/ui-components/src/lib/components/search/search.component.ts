import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { NgxSkeletonLoadingComponent } from '@digipay/ngx-skeleton-loading';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'common-ui-components-search',
  standalone: true,
  imports: [CommonModule, FormsModule, DpIconComponent, NgxSkeletonLoadingComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements AfterViewChecked {
  searchText = model<string | undefined>('');
  isLoading = input(false);
  mode = input<'page' | 'section'>('page');
  placeHolder = input('جست‌و‌جو');
  tempSearchText = signal<string | undefined>('');
  height = input('48px');
  leadingIcon = input<string>('search');
  trailingIcon = computed(() => {
    return this.tempSearchText() ? 'close-circle' : '';
  });
  readOnlyMode = input<boolean>(false);
  leadingIconClicked = output<void>();
  trailingIconClicked = output<void>();
  clicked = output<void | Event>();
  searchEnd = output<string>();
  searchEl = viewChild<ElementRef>('searchEl');
  initialized = false;
  constructor() {
    toObservable(this.searchText).subscribe((newSearchText) => {
      this.tempSearchText.set(newSearchText);
    });
    toObservable(this.isLoading).subscribe((loading) => {
      if (!loading) {
        this.initializeSearch();
      }
    });
  }

  ngAfterViewChecked() {
    this.initializeSearch();
  }

  initializeSearch(): void {
    if (this.searchEl()?.nativeElement && !this.initialized) {
      fromEvent(this.searchEl()?.nativeElement, 'input')
        .pipe(map((event: any) => (event.target as HTMLInputElement).value))
        .pipe(debounceTime(800))
        .pipe(distinctUntilChanged())
        .subscribe({
          next: () => {
            this.searchText.set(this.searchEl()?.nativeElement.value);
          },
        });
      fromEvent(this.searchEl()?.nativeElement, 'search')
        .pipe(debounceTime(900))
        .subscribe({
          next: () => {
            if (this.searchEl()?.nativeElement.value) {
              this.searchEnd.emit(this.searchEl()?.nativeElement.value);
            }
          },
        });
      this.initialized = true;
    }
  }
  handleClickOnTrailingIcon(): void {
    this.searchText.set('');
    this.tempSearchText.set('');
    this.trailingIconClicked.emit();
  }

  handleClick(event: Event): void {
    this.clicked.emit(event);
  }
}
