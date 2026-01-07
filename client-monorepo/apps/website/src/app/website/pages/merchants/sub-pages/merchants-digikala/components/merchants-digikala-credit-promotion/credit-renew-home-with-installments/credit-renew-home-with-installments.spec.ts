import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRenewHomeWithInstallmentsComponent } from './credit-renew-home-with-installments';

describe('CreditHomeAppliancesComponent', () => {
  let component: CreditRenewHomeWithInstallmentsComponent;
  let fixture: ComponentFixture<CreditRenewHomeWithInstallmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditRenewHomeWithInstallmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditRenewHomeWithInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
