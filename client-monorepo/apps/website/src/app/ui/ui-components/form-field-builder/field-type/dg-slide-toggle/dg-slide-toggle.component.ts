import { Component } from '@angular/core';
import { BaseFieldType } from '../../base-field-type/base-field-type';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dg-slide-toggle',
  templateUrl: './dg-slide-toggle.component.html',
  styleUrls: ['./dg-slide-toggle.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
})
export class DgSlideToggleComponent extends BaseFieldType {}
