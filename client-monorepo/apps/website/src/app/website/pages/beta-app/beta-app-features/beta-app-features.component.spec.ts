import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaAppFeaturesComponent } from './beta-app-features.component';

describe('BetaAppFeaturesComponent', () => {
  let component: BetaAppFeaturesComponent;
  let fixture: ComponentFixture<BetaAppFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BetaAppFeaturesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaAppFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
