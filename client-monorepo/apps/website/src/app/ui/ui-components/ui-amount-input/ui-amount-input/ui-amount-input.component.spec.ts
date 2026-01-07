import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiAmountInputComponent } from './ui-amount-input.component';

describe('UiAmountInputComponent', () => {
  let component: UiAmountInputComponent;
  let fixture: ComponentFixture<UiAmountInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiAmountInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiAmountInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
