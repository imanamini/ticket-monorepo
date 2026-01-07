import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPromotionTechBestSellersComponent } from './credit-promotion-tech-best-sellers.component';

describe('CreditPromotionTechBestSellersComponent', () => {
  let component: CreditPromotionTechBestSellersComponent;
  let fixture: ComponentFixture<CreditPromotionTechBestSellersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditPromotionTechBestSellersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditPromotionTechBestSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
