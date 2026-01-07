import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HorizontalSwiperComponent } from './horizontal-swiper.component';

describe('CardBrowserHorizontalScrollComponent', () => {
  let component: HorizontalSwiperComponent;
  let fixture: ComponentFixture<HorizontalSwiperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalSwiperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
