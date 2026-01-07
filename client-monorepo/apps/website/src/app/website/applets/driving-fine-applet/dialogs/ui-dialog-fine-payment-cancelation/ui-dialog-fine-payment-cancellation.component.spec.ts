import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDialogFinePaymentCancellationComponent } from './ui-dialog-fine-payment-cancellation.component';

describe('UiDialogFinePaymentCancelationComponent', () => {
  let component: UiDialogFinePaymentCancellationComponent;
  let fixture: ComponentFixture<UiDialogFinePaymentCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiDialogFinePaymentCancellationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiDialogFinePaymentCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
