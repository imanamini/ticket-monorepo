import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryCostPaymentComponent } from './inquiry-cost-payment.component';

describe('InquiryCostPaymentComponent', () => {
  let component: InquiryCostPaymentComponent;
  let fixture: ComponentFixture<InquiryCostPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InquiryCostPaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InquiryCostPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
