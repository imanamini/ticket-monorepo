import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSectionBenefitsComponent } from './ui-section-benefits.component';

describe('UiSectionBenefitsComponent', () => {
  let component: UiSectionBenefitsComponent;
  let fixture: ComponentFixture<UiSectionBenefitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSectionBenefitsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSectionBenefitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
