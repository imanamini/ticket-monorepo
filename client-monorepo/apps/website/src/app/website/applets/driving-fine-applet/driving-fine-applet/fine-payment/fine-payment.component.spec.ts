import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinePaymentComponent } from './fine-payment.component';

describe('FinePaymentComponent', () => {
  let component: FinePaymentComponent;
  let fixture: ComponentFixture<FinePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinePaymentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FinePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
