import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditAmountBottomSheetComponent } from './edit-credit-amount-bottom-sheet.component';

describe('EditCreditAmountBottomSheetComponent', () => {
  let component: EditCreditAmountBottomSheetComponent;
  let fixture: ComponentFixture<EditCreditAmountBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreditAmountBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreditAmountBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
