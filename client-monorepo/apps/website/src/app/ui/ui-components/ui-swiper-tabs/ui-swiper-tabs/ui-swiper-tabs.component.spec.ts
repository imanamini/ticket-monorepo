import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSwiperTabsComponent } from './ui-swiper-tabs.component';

describe('UiSwiperTabsComponent', () => {
  let component: UiSwiperTabsComponent;
  let fixture: ComponentFixture<UiSwiperTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiSwiperTabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSwiperTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
