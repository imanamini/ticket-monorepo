import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletManagementChartLabelComponent } from './wallet-management-chart-label.component';

describe('WalletManagementChartLabelComponent', () => {
  let component: WalletManagementChartLabelComponent;
  let fixture: ComponentFixture<WalletManagementChartLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletManagementChartLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletManagementChartLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
