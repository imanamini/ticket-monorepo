import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPlansTypesComponent } from './credit-plans-types.component';

describe('CreditInsurancePlansTypesComponent', () => {
  let component: CreditPlansTypesComponent;
  let fixture: ComponentFixture<CreditPlansTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditPlansTypesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditPlansTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
