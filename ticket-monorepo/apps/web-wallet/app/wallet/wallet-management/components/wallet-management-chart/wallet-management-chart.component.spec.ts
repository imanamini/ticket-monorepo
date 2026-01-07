import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletManagementChartComponent } from './wallet-management-chart.component';

describe('WalletManagementChartComponent', () => {
  let component: WalletManagementChartComponent;
  let fixture: ComponentFixture<WalletManagementChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletManagementChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletManagementChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
