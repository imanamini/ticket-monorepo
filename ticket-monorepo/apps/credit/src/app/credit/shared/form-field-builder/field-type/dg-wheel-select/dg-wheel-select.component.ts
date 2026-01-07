import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { BaseFieldType } from '../../base-field-type/base-field-type';
import { FormFieldOption } from '../../models/form-field-option.interface';

@Component({
  selector: 'app-dg-wheel-select',
  templateUrl: './dg-wheel-select.component.html',
  styleUrls: ['./dg-wheel-select.component.scss']
})
export class DgWheelSelectComponent extends BaseFieldType implements OnInit, AfterViewInit, OnChanges {

  selectedIndex = 0;
  elementHeight = 40;

  @Input()
  options: FormFieldOption[];

  @ViewChild('wheelSelect', {static: false})
  wheelSelect: ElementRef<HTMLDivElement>;

  changeValueTimer: any;

  ngOnInit(): void {
    this.setIndexByValue(false);
    this.form.controls[this.formControlName].valueChanges.subscribe(() => {
      this.setIndexByValue();
    });
  }

  ngAfterViewInit(): void {
    this.setManualScroll();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.options && !changes.options.firstChange) {
      this.setIndexByValue();
    }
  }

  setIndexByValue(scrollAfterSetIndex = true): void {
    const selectedIndex = this.options.findIndex(item => item.value === this.form.controls[this.formControlName].value);
    if (selectedIndex > 0 && selectedIndex !== this.selectedIndex) {
      this.selectedIndex = selectedIndex;
      if (scrollAfterSetIndex) {
        this.setManualScroll();
      }
    }
  }

  setManualScroll(): void {
    setTimeout(() => {
      if (this.wheelSelect.nativeElement) {
        this.wheelSelect.nativeElement.scrollTop = this.selectedIndex * this.elementHeight;
      }
    }, 0);
  }

  onScroll($event: any) {
    this.selectedIndex = Math.round($event.target.scrollTop / this.elementHeight);
    if (this.changeValueTimer) {
      clearTimeout(this.changeValueTimer);
    }
    this.changeValueTimer = setTimeout(() => {
      this.form.controls[this.formControlName].setValue(this.options[this.selectedIndex].value);
    }, 200);
  }

  selectItem(index: number) {
    this.wheelSelect.nativeElement.scrollTop = index * this.elementHeight;
  }
}
