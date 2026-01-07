import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTariffComponent } from './ui-tariff.component';

describe('UiTariffComponent', () => {
  let component: UiTariffComponent;
  let fixture: ComponentFixture<UiTariffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiTariffComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
