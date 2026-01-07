import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { interval, Subscription } from 'rxjs';
import { DpIconComponent } from '@client-monorepo/common/icon';
import { UiLoadingDotsComponent } from '@client-monorepo/common/ui-components';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { AbTestService } from '@client-monorepo/common/utilities';

@Component({
  selector: 'common-ui-dynamic-pass-field',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, DpIconComponent, UiLoadingDotsComponent, NgxButtonComponent],
  templateUrl: './ui-dynamic-pass-field.component.html',
  styleUrls: ['./ui-dynamic-pass-field.component.scss'],
})
export class UiDynamicPassFieldComponent implements OnChanges {
  @Input()
  enableSendButton = false;

  @Input()
  inProgress = false;

  @Input()
  countdownSeconds!: number | null;

  @Input()
  value = '';

  @Output()
  sendButtonClicked = new EventEmitter();

  @Output()
  countdownFinished = new EventEmitter();

  @Output()
  inputFocusIn = new EventEmitter();

  @Input()
  validationRules: any[] = [];

  @Input()
  parentForm!: UntypedFormGroup;

  @Input()
  controlName!: string;

  @Input()
  autofocus!: boolean;

  timeoutSubscription!: Subscription;

  showParentheses = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['countdownSeconds']) {
      this.timeoutSubscription = interval(1000).subscribe(() => {
        if (this.countdownSeconds && this.countdownSeconds > 0) {
          this.countdownSeconds--;
        } else {
          this.onFinish();
          this.timeoutSubscription.unsubscribe();
        }
      });
    }
  }

  onSend() {
    if (!this.enableSendButton) {
      return;
    }
    this.sendButtonClicked.emit();
  }

  onFinish() {
    this.countdownFinished.emit();
  }

  onFocusIn(event: any) {
    this.inputFocusIn.emit(event);
  }

  private pan(value: number): string {
    if (value < 10) {
      // @ts-expect-error value
      value = '0' + String(value);
    }

    return String(value);
  }

  get formattedTime() {
    const seconds = Math.max(0, Number(this.countdownSeconds));
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return {
      minutes: this.pan(m),
      seconds: this.pan(s),
    };
  }

  protected readonly AbTestService = AbTestService;
}
