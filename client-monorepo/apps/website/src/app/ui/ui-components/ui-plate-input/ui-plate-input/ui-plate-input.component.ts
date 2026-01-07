import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UiDialogPlateLetterSelectComponent } from '../../../../website/applets/driving-fine-applet/dialogs/ui-dialog-plate-letter-select/ui-dialog-plate-letter-select.component';
import { PlateColor } from '../../../../api/digipay/models/driving-fine/vehicle-plate';
import { DialogBottomSheetService } from '../../../../core/services/dialog-bottom-sheet.service';
import { UiVehiclePlateLetterComponent } from '../../ui-vehicle-plate-letter/ui-vehicle-plate-letter/ui-vehicle-plate-letter.component';
import { FormDirectivesModule } from '@digipay/ng-form-directives';
import { NgClass, NgStyle, NgIf } from '@angular/common';

@Component({
  selector: 'app-ui-plate-input',
  templateUrl: './ui-plate-input.component.html',
  styleUrls: ['./ui-plate-input.component.scss'],
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgStyle, FormDirectivesModule, NgIf, UiVehiclePlateLetterComponent],
})
export class UiPlateInputComponent implements OnInit {
  @Output()
  valueChange = new EventEmitter();

  letterKeyboardOpen = false;

  @ViewChild('part3Input', {
    static: false,
  })
  part3Input: ElementRef<HTMLInputElement>;

  @ViewChild('part4Input', {
    static: false,
  })
  part4Input: ElementRef<HTMLInputElement>;

  @Input()
  value: string;

  @Input()
  disabled = false;

  @Input()
  readonly = false;

  @Input()
  values: {
    part1: string;
    part2: string;
    part3: string;
    part4: string;
  };

  @Input()
  colors: {
    [code: string]: PlateColor;
  } = {};

  @Input()
  clearSignal = 0;

  form: FormGroup;

  bgColor = '';

  textColor = '';

  invertColor = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialog: DialogBottomSheetService,
  ) {
    this.form = this.formBuilder.group({
      part1: [''],
      part2: [''],
      part3: [''],
      part4: [''],
    });

    this.form.controls.part3.valueChanges.subscribe((val) => {
      if (val.length === 3) {
        this.focusOnPart4();
      }
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((val) => {
      this.valueChange.emit(val);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value && changes.value.currentValue) {
      this.setValue();
    }
    if (changes.values && changes.values.currentValue) {
      this.setValuesSeparately();
    }
    if (changes.clearSignal && changes.clearSignal.currentValue) {
      this.clearValues();
    }
  }

  openSelectPlateLetterDialog() {
    this.dialog
      .open(UiDialogPlateLetterSelectComponent, {
        width: '360px',
        height: '264px',
      })
      .then((dialogData) => {
        this.letterKeyboardOpen = false;
        if (!dialogData) {
          return;
        }
        this.values.part2 = dialogData;
        this.letterPicked(dialogData);
      });
  }

  openLetterKeyboard(): void {
    if (!this.letterKeyboardOpen) {
      this.openSelectPlateLetterDialog();
      this.letterKeyboardOpen = true;
    }
  }

  letterPicked(letter: string): void {
    this.form.patchValue({
      part2: letter,
    });

    this.setColors(letter);

    this.focusOnPart3();
  }

  /**
   * UX: Open the letter picker when left
   * numbers is filled
   *
   * @param $event
   */
  leftNumbersKeyUp($event) {
    if ($event.target.value.length === 2 && !this.value) {
      this.openLetterKeyboard();
    }
  }

  private clearValues(): void {
    this.form.patchValue(
      {
        part1: '',
        part2: '',
        part3: '',
        part4: '',
      },
      {
        emitEvent: false,
      },
    );
  }

  private setValue(): void {
    const part1 = this.value.substr(0, 2);
    const part2 = this.value.substr(2, 2);
    const part3 = this.value.substr(4, 3);
    const part4 = this.value.substr(7, 2);

    this.form.patchValue(
      {
        part1,
        part2,
        part3,
        part4,
      },
      {
        emitEvent: false,
      },
    );

    if (part2) {
      this.setColors(part2);
    }
  }

  private setValuesSeparately(): void {
    this.form.patchValue(this.values, {
      emitEvent: false,
    });

    if (this.values.part2) {
      this.setColors(this.values.part2);
      if (this.values.part3.length === 0) {
        this.focusOnPart3();
      }
    }
  }

  private setColors(letter: string): void {
    if (this.colors.hasOwnProperty(letter)) {
      this.bgColor = '#' + this.colors[letter].bgColor;
      this.textColor = '#' + this.colors[letter].textColor;
      this.invertColor = this.colors[letter].textColor.toLowerCase() === 'ffffff';
    } else {
      this.bgColor = '';
      this.textColor = '';
      this.invertColor = false;
    }
  }

  private focusOnPart3(): void {
    if (this.part3Input && this.part3Input.nativeElement) {
      this.part3Input.nativeElement.focus();
    }
  }

  private focusOnPart4(): void {
    if (this.part4Input && this.part4Input.nativeElement) {
      this.part4Input.nativeElement.focus();
    }
  }
}
