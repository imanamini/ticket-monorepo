import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { currencyFormat } from '@digipay/strings';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-ui-amount-input',
  templateUrl: './ui-amount-input.component.html',
  styleUrls: ['./ui-amount-input.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule, FormDirectivesModule, FormsModule],
})
export class UiAmountInputComponent implements AfterContentInit, OnChanges, AfterViewInit {
  @Input()
  value: any = '';
  @Input() mobileMode = false;
  @Input() autoSelect = false;
  @Input()
  blueBorder = false;
  @Input()
  withHint = false;
  @Input() hint = '';

  @ViewChild('input', {
    static: false,
  })
  input: ElementRef<HTMLInputElement>;

  @Output()
  valueChanged = new EventEmitter();

  baseWidth = 10;

  @Input()
  enabled = true;

  @Input()
  maxLength = 0;

  @Input()
  errorState = false;

  @Input()
  placeholder = '';

  get inputWidth(): number {
    if (this.value && this.value.length > 0) {
      return this.value.length * this.baseWidth;
    }

    return this.baseWidth;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.formatAmount();
    }
  }

  ngAfterContentInit(): void {
    of('')
      .pipe(delay(0))
      .subscribe({
        next: () => {
          if (this.value) {
            this.value = currencyFormat(this.value);
            this.valueChanged.emit(this.value);
          }
        },
      });
  }

  ngAfterViewInit(): void {
    if (this.autoSelect) {
      this.wrapperClick(null);
    }
  }

  onValueChanged($event): void {
    this.value = $event;
    this.valueChanged.emit($event);
  }

  wrapperClick($event): void {
    this.input.nativeElement.focus();
  }

  private formatAmount(): void {
    this.value = currencyFormat(this.value);
  }
}
