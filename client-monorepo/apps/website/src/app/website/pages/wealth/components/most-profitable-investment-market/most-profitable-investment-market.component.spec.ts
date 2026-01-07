import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostProfitableInvestmentMarketComponent } from './most-profitable-investment-market.component';

describe('MostProfitableInvestmentMarketComponent', () => {
  let component: MostProfitableInvestmentMarketComponent;
  let fixture: ComponentFixture<MostProfitableInvestmentMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MostProfitableInvestmentMarketComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MostProfitableInvestmentMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
