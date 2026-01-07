import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextFieldNoticeMark } from './directives/text-field-notice-mark.directive';
import { FieldMark } from './directives/text-field-input-mark.directive';
import { TextFieldComponent } from './text-field/text-field.component';
import { FormNoticeComponent } from './form-notice/text-field-notice.component';
import { SelectComponent } from './select/select.component';

@NgModule({
    declarations: [
        TextFieldNoticeMark,
        FieldMark,
        TextFieldComponent,
        FormNoticeComponent,
        SelectComponent,
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        TextFieldNoticeMark,
        FieldMark,
        TextFieldComponent,
        FormNoticeComponent,
        SelectComponent,
    ]
})
export class UiFormModule {
}
