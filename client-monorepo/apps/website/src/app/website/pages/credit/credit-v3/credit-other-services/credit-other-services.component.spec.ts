import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditOtherServicesComponent } from './credit-other-services.component';

describe('CreditOtherServicesComponent', () => {
  let component: CreditOtherServicesComponent;
  let fixture: ComponentFixture<CreditOtherServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditOtherServicesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditOtherServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
