import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPaymentReceiptComponent } from './ui-payment-receipt.component';

describe('UiPaymentReceiptComponent', () => {
  let component: UiPaymentReceiptComponent;
  let fixture: ComponentFixture<UiPaymentReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiPaymentReceiptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiPaymentReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
