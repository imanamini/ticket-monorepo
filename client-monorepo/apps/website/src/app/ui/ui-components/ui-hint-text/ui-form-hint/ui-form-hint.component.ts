import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-ui-form-hint',
  templateUrl: './ui-form-hint.component.html',
  styleUrls: ['./ui-form-hint.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass],
})
export class UiFormHintComponent {
  @Input()
  appearance: 'hint' | 'error' = 'hint';

  @Input()
  formControlVisibilityCheck: AbstractControl = null; // shows the message if control is touched and invalid
}
