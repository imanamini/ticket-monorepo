import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { VirtualKeypadService } from '../virtual-keypad/virtual-keypad.service';
import { DeviceService } from '../../../core/services/device/device.service';
import { VirtualKeypadComponent } from '../virtual-keypad/virtual-keypad.component';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { NgIf, NgClass } from '@angular/common';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-pin-input',
  templateUrl: './pin-input.component.html',
  styleUrls: ['./pin-input.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, FormDirectivesModule, VirtualKeypadComponent],
})
export class PinInputComponent implements OnInit, OnChanges {
  @Input()
  description = '';

  @Input()
  value = '';

  @Input()
  hasError = false;

  @Output()
  pinChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('inputs')
  inputs: ElementRef<HTMLDivElement>;

  inputIndex = 0;

  constructor(
    private keyboard: VirtualKeypadService,
    private deviceService: DeviceService,
  ) {
    this.value = '';
  }

  ngOnInit() {
    this.keyboard.open.next(true);
    if (this.hasAPhysicalKeyboard()) {
      of('')
        .pipe(delay(300))
        .subscribe({
          next: () => {
            this.focusOnFirstInput();
          },
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasError && changes.hasError.previousValue === true && changes.hasError.currentValue === false) {
      this.value = '';
      for (let i = 0; i < this.inputs.nativeElement.children.length; i++) {
        const el = this.inputs.nativeElement.children.item(i);
        const input = el.children.item(0) as HTMLInputElement;
        input.value = '';
        this.focusOnFirstInput();
      }
    }
  }

  hasAPhysicalKeyboard() {
    return !this.shouldDisplayVirtualKeyboard();
  }

  keypadKeyPress(key) {
    switch (key) {
      case 'Backspace':
        if (this.value.length > 0) {
          this.value = this.value.substr(0, this.value.length - 1);
        }
        break;
      default:
        if (this.value.length < 4) {
          this.value += key;
        }
        break;
    }

    this.pinChange.emit(this.value);
  }

  shouldDisplayVirtualKeyboard() {
    return this.deviceService.isIOsDevice() || this.deviceService.isAndroidDevice() || this.deviceService.isMobileOrTablet();
  }

  focusOnFirstInput() {
    this.inputIndex = 0;
    const el = this.inputs.nativeElement.children.item(this.inputIndex);
    const input = el.children.item(0) as HTMLInputElement;
    this.focusOnInput(input);
  }

  focusOnInput(element: HTMLInputElement) {
    element.focus();
  }

  inputKeyUp($event) {
    const i = this.inputIndex;
    if ($event.target.value.length === 1 && $event.key !== 'Backspace' && this.inputIndex < 3) {
      this.inputIndex++;
    }
    if ($event.key === 'Backspace' && this.inputIndex > 0) {
      this.inputIndex--;
    }

    this.keypadKeyPress($event.key);

    if (this.inputIndex !== i) {
      const el = this.inputs.nativeElement.children.item(this.inputIndex);
      const input = el.children.item(0) as HTMLInputElement;
      this.focusOnInput(input);
    }
  }
}
