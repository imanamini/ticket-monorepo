import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayAmountComponent } from './pay-amount.component';

describe('PayFlowComponent', () => {
  let component: PayAmountComponent;
  let fixture: ComponentFixture<PayAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
