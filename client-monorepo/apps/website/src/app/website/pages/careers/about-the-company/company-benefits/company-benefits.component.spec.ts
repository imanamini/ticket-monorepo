import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBenefitsComponent } from './company-benefits.component';

describe('CompanyBenefitsComponent', () => {
  let component: CompanyBenefitsComponent;
  let fixture: ComponentFixture<CompanyBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyBenefitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
