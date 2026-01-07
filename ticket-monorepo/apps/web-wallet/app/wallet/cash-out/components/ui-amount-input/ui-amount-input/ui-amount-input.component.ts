import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { currencyFormat } from '@digipay/strings';
import {NgClass, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserInterfaceModule} from "../../../../../user-interface/user-interface.module";

@Component({
  selector: 'amount-input',
  templateUrl: './ui-amount-input.component.html',
  styleUrls: ['./ui-amount-input.component.scss'],
  imports: [
    NgClass,
    FormsModule,
    UserInterfaceModule,
    NgIf
  ],
  standalone: true
})
export class amountInputComponent implements OnInit, AfterContentInit, OnChanges, AfterViewInit {

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
    static: false
  })
  input: ElementRef<HTMLInputElement>;

  @Output()
  valueChanged = new EventEmitter();

  baseWidth = 20;

  @Input()
  enabled = true;

  @Input()
  maxLength = 0;

  @Input()
  errorState = false;

  @Input()
  placeholder = '';

  constructor() {
  }

  get inputWidth(): number {
    if (this.value && this.value.length > 0) {
      return this.value.length * this.baseWidth;
    }

    return this.baseWidth;
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.formatAmount();
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      if (this.value) {
        this.value = currencyFormat(this.value, '٬');
        this.valueChanged.emit(this.value);
      }
    }, 0);
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
    this.value = currencyFormat(this.value, '٬');
  }
}
