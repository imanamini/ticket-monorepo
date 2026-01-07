import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentStepsComponent } from './investment-steps.component';

describe('WealthStepsComponent', () => {
  let component: InvestmentStepsComponent;
  let fixture: ComponentFixture<InvestmentStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvestmentStepsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestmentStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
