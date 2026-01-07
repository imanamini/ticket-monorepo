import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  OnInit,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { KeyPadButtons } from '../../data-access/models/credit/generate-digital-signature/password-signature/key-pad-buttons';
import { NgxSpinnerModule } from '@digipay/ngx-spinner';
import { NgxTrackableIdDirective } from '@digipay/ngx-trackable-id';
import { NgxButtonComponent } from '@digipay/ngx-button';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { NgxIcon } from '@digipay/ngx-icon';

@Component({
  selector: 'app-credit-password-signature',
  templateUrl: './credit-password-signature.component.html',
  styleUrls: ['./credit-password-signature.component.scss'],
  standalone: true,
  imports: [FormDirectivesModule, NgxButtonComponent, NgxTrackableIdDirective, NgxSpinnerModule, NgxIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditPasswordSignatureComponent implements OnInit {
  description = input<string>('');
  errorText = input<string>('');
  staticImage = input<'set-password' | 'set-repeat-password'>('set-password');
  actionType = input<'VERIFICATION' | 'REGISTRATION'>('REGISTRATION');
  showForgetPassword = input<boolean>(false);
  loading = model<boolean>(false);
  step = model<number>(0);

  pinChange = output<void>();
  submitted = output<{ step: number; password: string }>();
  keyboardFire = output<void>();
  forgotPassword = output<void>();

  inputs = viewChild<ElementRef<HTMLDivElement>>('inputs');

  valueArray: string[] = [];
  value = signal('');
  inputIndex = signal(0);
  pinInputs = signal(new Array(4));
  keyPadButtons = signal<KeyPadButtons[]>([
    { value: 1, type: 'number' },
    { value: 2, type: 'number' },
    { value: 3, type: 'number' },
    { value: 4, type: 'number' },
    { value: 5, type: 'number' },
    { value: 6, type: 'number' },
    { value: 7, type: 'number' },
    { value: 8, type: 'number' },
    { value: 9, type: 'number' },
    { value: null, type: 'remove' },
    { value: 0, type: 'number' },
    { value: null, type: 'submit' },
  ]);

  inputsBorderLight = computed(() => !this.errorText().length && (!this.value().length || this.value().length === 4));
  inputsBorderBrand = computed(() => !this.errorText().length && this.value().length && this.value().length < 4);

  constructor() {
    effect(
      () => {
        const errorTextValue = this.errorText();
        if (errorTextValue) {
          this.loading.set(false);
          untracked(() => {
            this.clearValue();
            for (let i = 0; i < this.inputs()?.nativeElement.children.length!; i++) {
              const input = this.inputs()?.nativeElement.children.item(i) as HTMLInputElement;
              input.value = '';
            }
            this.focusOnFirstInput();
          });
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.focusOnFirstInput();
    }, 300);

    this.clearValue();
  }

  onInputKeyUp() {
    this.keyboardFire.emit();
  }

  focusOnFirstInput(): void {
    this.dynamicFocusInput(0);
  }

  dynamicFocusInput(index: number) {
    if (index < 0 || index >= 3) {
      return;
    }
    this.inputIndex.set(index);
    if (!this.inputs()) {
      return;
    }
    const input = this.inputs()?.nativeElement.children.item(this.inputIndex()) as HTMLInputElement;
    this.focusOnInput(input);
  }

  focusOnInput(element: HTMLInputElement): void {
    element.focus();
  }

  inputFocusIn(i: number): void {
    this.inputIndex.set(i);
  }

  keyPadHit(element: KeyPadButtons) {
    const i = this.inputIndex();
    const max = this.getMaxIndex();
    switch (element.type) {
      case 'remove':
        this.valueArray[i] = '';
        this.setValueToInput(i, this.valueArray[i]);
        this.dynamicFocusInput(this.inputIndex() > 1 ? this.inputIndex() - 1 : 0);
        break;
      case 'submit':
        this.onConfirm();
        this.dynamicFocusInput(this.inputIndex());
        return;
      case 'number':
        if (this.value().length === 4) {
          return;
        }

        if (this.value().length === 0) {
          this.pinChange.emit();
        }

        if (!isNaN(element.value!)) {
          this.valueArray[i] = element.value!.toString();
          this.setValueToInput(this.inputIndex(), element?.value?.toString()!);
          if (this.inputIndex() < max) {
            this.inputIndex.update((index) => index + 1);
          }
          const nextInput = this.getInput(this.inputIndex());
          if (this.inputIndex() !== i) {
            this.focusOnInput(nextInput);
          }
        }
        break;
    }
  }

  setValueToInput(index: number, value: string) {
    this.value.set(this.valueArray.join(''));
    const input = this.inputs()?.nativeElement.children.item(index) as HTMLInputElement;
    input.type = 'text';
    input.value = value;
    setTimeout(() => {
      input.type = 'password';
    }, 300);
  }

  onConfirm() {
    if (this.actionType() === 'VERIFICATION') {
      this.loading.set(true);
    }

    if (this.actionType() === 'REGISTRATION' && this.value().length === 4) {
      this.step.update((step) => step + 1);
    }
    this.submitted.emit({ step: this.step(), password: this.value() });
  }

  private clearValue(): void {
    this.valueArray = new Array(this.getMaxIndex() + 1).join('.').split('.');
    this.value.set('');
  }

  private getInput(index: number): HTMLInputElement {
    return this.inputs()?.nativeElement.children.item(index) as HTMLInputElement;
  }

  private getMaxIndex(): number {
    return this.pinInputs().length - 1;
  }
}
