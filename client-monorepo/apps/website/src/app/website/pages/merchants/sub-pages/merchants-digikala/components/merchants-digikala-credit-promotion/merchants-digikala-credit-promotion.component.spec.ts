import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantsDigikalaCreditPromotionComponent } from './merchants-digikala-credit-promotion.component';

describe('MerchantsDigikalaCreditPromotionComponent', () => {
  let component: MerchantsDigikalaCreditPromotionComponent;
  let fixture: ComponentFixture<MerchantsDigikalaCreditPromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MerchantsDigikalaCreditPromotionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MerchantsDigikalaCreditPromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
