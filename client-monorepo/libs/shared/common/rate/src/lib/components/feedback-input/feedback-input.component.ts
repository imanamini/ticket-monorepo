import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiFormFieldBuilderModule } from '@digipay/ui-form-field-builder';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxChipComponent } from '@digipay/ngx-chip';

@Component({
  selector: 'common-rate-feedback-input',
  standalone: true,
  imports: [CommonModule, UiFormFieldBuilderModule, ReactiveFormsModule, NgxChipComponent],
  templateUrl: './feedback-input.component.html',
  styleUrl: './feedback-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackInputComponent implements OnInit, OnDestroy {
  // Injections
  fb = inject(FormBuilder);

  // Inputs
  title = input<string>('');
  chips = input<string[]>([]);
  showCommentInput = input<boolean>(true);
  chipsSelectionLimit = input<number>(0); // undefined or 0 to disable it

  // Outputs
  chipsSelected = output<string[]>();
  commentAdded = output<string>();

  // Variables
  protected readonly String = String;
  isCommentMultiline = signal<boolean>(false);
  selectedChips: string[] = [];
  form = this.fb.group({
    comment: new FormControl('', []),
  });
  subscriptions = new Subscription();

  ngOnInit(): void {
    this.handleCommentInput();
  }

  handleChipSelect(chip: string): void {
    if (this.chipsSelectionLimit()) {
      if (this.selectedChips.includes(chip)) {
        this.selectedChips.splice(this.selectedChips.indexOf(chip), 1);
      } else {
        if (this.selectedChips.length > this.chipsSelectionLimit() - 1) {
          return;
        } else {
          this.selectedChips.push(chip);
        }
      }
    }
    this.chipsSelected.emit(this.selectedChips);
  }

  isChipDisabled(chip: string): boolean {
    if (this.chipsSelectionLimit()) {
      return this.selectedChips.length > this.chipsSelectionLimit() - 1 && !this.selectedChips.includes(chip);
    } else {
      return false;
    }
  }

  handleCommentInput(): void {
    this.subscriptions.add(
      this.form.controls.comment.valueChanges.subscribe({
        next: (value) => {
          this.commentAdded.emit(value ?? '');
        },
      }),
    );
  }

  // handleCommentInputMultiline(): void {
  //   this.isCommentMultiline.update((v) => {
  //     return !v;
  //   });
  // }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
