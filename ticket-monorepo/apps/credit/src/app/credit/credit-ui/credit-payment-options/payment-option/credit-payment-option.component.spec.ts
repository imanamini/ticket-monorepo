import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPaymentOptionComponent } from './credit-payment-option.component';

describe('CreditServiceComponent', () => {
  let component: CreditPaymentOptionComponent;
  let fixture: ComponentFixture<CreditPaymentOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditPaymentOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPaymentOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
