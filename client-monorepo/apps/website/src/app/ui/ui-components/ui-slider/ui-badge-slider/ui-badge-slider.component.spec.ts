import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiBadgeSliderComponent } from './ui-badge-slider.component';

describe('UiPackageSliderComponent', () => {
  let component: UiBadgeSliderComponent;
  let fixture: ComponentFixture<UiBadgeSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiBadgeSliderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiBadgeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
