import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AlphabetOptions } from './alphabet-options';
import { NumberOptions } from './number-options';
import { NgxBottomSheetService } from '@digipay/ngx-bottom-sheet';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormsModule } from '@angular/forms';
import { NgxButtonComponent } from '@digipay/ngx-button';

@Component({
  selector: 'app-note-serial-selector',
  templateUrl: './note-serial-selector.component.html',
  standalone: true,
  styleUrl: './note-serial-selector.component.scss',
  imports: [UiFormFieldBuilderModule, FormsModule, NgxButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteSerialSelectorComponent {
  alphabetPart = signal<string | null>(null);
  numberPart = signal<string | null>(null);
  alphabetOptions = AlphabetOptions;
  numberOptions = NumberOptions;
  bottomSheetService = inject(NgxBottomSheetService);

  constructor() {
    this.alphabetPart.set(this.bottomSheetService.data().alphabetPart ?? this.alphabetOptions[0].value);
    this.numberPart.set(this.bottomSheetService.data().numberPart ?? this.numberOptions[0].value);
  }

  onSubmit() {
    this.bottomSheetService.outputData.set({
      alphabetPart: this.alphabetPart()!,
      numberPart: this.numberPart()!,
    });
    this.bottomSheetService.closeBottomSheet();
  }
}
