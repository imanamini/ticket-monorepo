import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[uiNotice]'
})
/**
 * Use this directive to mark the elements that you want
 * to display below the text field (like errors & hints)
 * Usually should be used on the <ng-container> tag
 *
 *
 * <app-text-field [clearable]="true"  label="جدید" name="myField" [form]="form">
 *   <input type="text" formControlName="myField" *tfInputMark>
 *   <ng-container *uiNotice>
 *    <tf-notice [visible]="true">This is an error text</tf-notice>
 *    </ng-container>
 * </app-text-field>
 */
export class TextFieldNoticeMark {

  constructor(
    public template: TemplateRef<any>
  ) {}

}
