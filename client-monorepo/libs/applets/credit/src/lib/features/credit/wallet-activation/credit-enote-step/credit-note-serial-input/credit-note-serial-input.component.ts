import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { NoteSerialSelectorComponent } from './note-serial-selector/note-serial-selector.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';

const defaultErrorMapper = {
  required: 'این فیلد اجباری است',
};

@Component({
  selector: 'app-credit-note-serial-input',
  templateUrl: './credit-note-serial-input.component.html',
  styleUrl: './credit-note-serial-input.component.scss',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: CreditNoteSerialInputComponent,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditNoteSerialInputComponent implements ControlValueAccessor, OnInit {
  error = input<ValidationErrors | null | undefined>();
  userErrorMapper = input<Record<string, string>>();

  errorMapper = signal<Record<string, string> | null>(null);
  alphabetPart = signal<string | null>(null);
  numberPart = signal<string | null>(null);

  touched = signal(false);
  protected readonly Object = Object;
  bottomSheetService = inject(NgxBottomSheetService);

  ngOnInit() {
    this.errorMapper.set(Object.assign({}, defaultErrorMapper, this.userErrorMapper()));
  }

  propagateChange = (compound: string) => {};
  propagateTouch = () => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  markAsTouched() {
    if (!this.touched()) {
      this.propagateTouch();
      this.touched.set(true);
    }
  }

  writeValue(series: string): void {
    if (series.indexOf('/') > 0) {
      const seriesArray = series.split('/');
      this.numberPart.set(seriesArray?.[0]);
      this.alphabetPart.set(seriesArray?.[1]);
    }
  }

  onInputHandler() {
    this.markAsTouched();
    this.bottomSheetService.openBottomSheet(NoteSerialSelectorComponent, {
      alphabetPart: this.alphabetPart()!,
      numberPart: this.numberPart()!,
    });

    const bottomSheet = this.bottomSheetService.onClose.subscribe(() => {
      const result = this.bottomSheetService.outputData();
      bottomSheet.unsubscribe();
      if (result) {
        this.alphabetPart.set(result.alphabetPart);
        this.numberPart.set(result.numberPart);
        const compound = this.numberPart() + '/' + this.alphabetPart();
        this.propagateChange(compound);
      }
    });
  }
}
