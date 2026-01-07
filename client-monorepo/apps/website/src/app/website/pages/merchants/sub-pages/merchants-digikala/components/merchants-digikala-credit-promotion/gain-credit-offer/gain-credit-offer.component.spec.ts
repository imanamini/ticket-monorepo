import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GainCreditOfferComponent } from './gain-credit-offer.component';

describe('GainCreditOfferComponent', () => {
  let component: GainCreditOfferComponent;
  let fixture: ComponentFixture<GainCreditOfferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GainCreditOfferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GainCreditOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
