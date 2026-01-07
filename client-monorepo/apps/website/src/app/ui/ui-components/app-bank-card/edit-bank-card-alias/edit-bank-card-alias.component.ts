import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { convertStoredCardToCardProfile } from '../../../../utils/card-helpers';
import { StoredCard } from '../../../../core/models/card/stored-card.model';
import { CardProfile } from '../../../../core/models/card/card-profile-response.model';
import { UiTextFieldComponent } from '../../ui-form/text-field/ui-text-field.component';
import { BankCardComponent } from '../bank-card.component';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-edit-bank-card-alias',
  templateUrl: './edit-bank-card-alias.component.html',
  styleUrls: ['./edit-bank-card-alias.component.scss'],
  standalone: true,
  imports: [BankCardComponent, UiTextFieldComponent],
})
export class EditBankCardAliasComponent implements OnInit {
  card: StoredCard;

  cardProfile: CardProfile;

  form: FormGroup;

  initialized = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditBankCardAliasComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
  ) {
    this.card = dialogData.card;

    this.cardProfile = convertStoredCardToCardProfile(this.card);

    this.form = this.formBuilder.group({
      alias: [this.card.alias, Validators.required],
    });
  }

  ngOnInit() {
    // small amount of delay to fix
    // material UI's bug in positioning the floating label

    of('')
      .pipe(delay(100))
      .subscribe({
        next: () => {
          this.initialized = true;
        },
      });
  }

  dialogClose(confirmed: boolean) {
    if (confirmed) {
      if (this.form.controls.alias.value && this.form.valid) {
        this.dialogRef.close({
          confirmed,
          alias: this.form.controls.alias.value,
        });
      }
    } else {
      this.dialogRef.close(confirmed);
    }
  }
}
