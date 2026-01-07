import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { convertNonEnglishDigits } from '../../../utils/strings';

@Component({
  selector: 'ui-digit-input',
  templateUrl: './ui-digit-input.component.html',
  styleUrls: ['./ui-digit-input.component.scss']
})
export class UiDigitInputComponent implements OnChanges, AfterViewInit {

  @Input()
  length = 4;

  @Input()
  enabled: boolean = true;

  @ViewChild('digitInputEl', {
    static: false
  })
  element: ElementRef<HTMLDivElement>;

  inputIndex = 0;

  value = ['', '', '', ''];

  @Output()
  changed = new EventEmitter<string>();

  @Input()
  clearSignal = 0;

  ngAfterViewInit(): void {
    setTimeout(() => {
      document.getElementById('pin-input-0').focus();
    }, 200);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clearSignal'] && changes['clearSignal'].currentValue !== changes['clearSignal'].previousValue) {
      this.inputIndex = 0;
      this.value = ['', '', '', ''];
      this.changeCallback();
    }
  }

  focusOnInput(element: HTMLInputElement) {
    element.focus();
  }

  inputKeyUp($event, i: number) {

    if ($event.target.value.length === 1 && $event.key !== 'Backspace' && this.inputIndex < 3) {
      this.inputIndex++;
    }

    if ($event.key === 'Backspace' && this.inputIndex > 0) {
      this.inputIndex--;
    }

    if (this.inputIndex !== i) {
      const el = this.element.nativeElement.children.item(this.inputIndex);
      const input = el.children.item(0) as HTMLInputElement;
      this.focusOnInput(input);
    }

    this.changeCallback();
  }

  changeCallback() {
    this.changed.emit(convertNonEnglishDigits(this.value.join('')));
  }
}
