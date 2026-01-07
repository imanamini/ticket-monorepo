import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayStepsComponent } from './pay-steps.component';

describe('PayStepsComponent', () => {
  let component: PayStepsComponent;
  let fixture: ComponentFixture<PayStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
