import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiCellNumberFieldComponent } from './ui-cell-number-field.component';

describe('UiCellNumberFieldComponent', () => {
  let component: UiCellNumberFieldComponent;
  let fixture: ComponentFixture<UiCellNumberFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiCellNumberFieldComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCellNumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
