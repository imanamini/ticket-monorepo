import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSectionSlidingIntroductionComponent } from './ui-section-sliding-introduction.component';

describe('UiSlidingIntroductionComponent', () => {
  let component: UiSectionSlidingIntroductionComponent;
  let fixture: ComponentFixture<UiSectionSlidingIntroductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSectionSlidingIntroductionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSectionSlidingIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
