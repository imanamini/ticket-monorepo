import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSliderVerticalComponent } from './image-slider-vertical.component';

describe('ImageSliderVerticalComponent', () => {
  let component: ImageSliderVerticalComponent;
  let fixture: ComponentFixture<ImageSliderVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageSliderVerticalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSliderVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
