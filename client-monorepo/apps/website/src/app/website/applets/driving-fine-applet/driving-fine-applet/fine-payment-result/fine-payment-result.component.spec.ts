import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinePaymentResultComponent } from './fine-payment-result.component';

describe('FinePaymentResultComponent', () => {
  let component: FinePaymentResultComponent;
  let fixture: ComponentFixture<FinePaymentResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinePaymentResultComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinePaymentResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
