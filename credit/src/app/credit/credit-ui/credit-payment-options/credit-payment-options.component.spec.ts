import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPaymentOptionsComponent } from './credit-payment-options.component';

describe('CreditServiceListComponent', () => {
  let component: CreditPaymentOptionsComponent;
  let fixture: ComponentFixture<CreditPaymentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditPaymentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditPaymentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
