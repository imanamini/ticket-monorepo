import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillBenefitComponent } from './bill-benefit.component';

describe('BillBenefitComponent', () => {
  let component: BillBenefitComponent;
  let fixture: ComponentFixture<BillBenefitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillBenefitComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
