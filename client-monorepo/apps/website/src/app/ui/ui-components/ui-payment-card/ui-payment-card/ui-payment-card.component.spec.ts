import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiPaymentCardComponent } from './ui-payment-card.component';

describe('UiPaymentCardComponent', () => {
  let component: UiPaymentCardComponent;
  let fixture: ComponentFixture<UiPaymentCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiPaymentCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiPaymentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
