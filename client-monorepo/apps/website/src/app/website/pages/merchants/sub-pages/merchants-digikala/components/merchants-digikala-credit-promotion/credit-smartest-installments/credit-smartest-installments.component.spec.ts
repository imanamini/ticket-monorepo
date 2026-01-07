import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSmartestInstallmentsComponent } from './credit-smartest-installments.component';

describe('CreditSmartestInstallmentsComponent', () => {
  let component: CreditSmartestInstallmentsComponent;
  let fixture: ComponentFixture<CreditSmartestInstallmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditSmartestInstallmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditSmartestInstallmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
