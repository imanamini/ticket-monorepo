import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiSimpleMasonryComponent } from './ui-simple-masonry.component';

describe('UiSimpleMasonryComponent', () => {
  let component: UiSimpleMasonryComponent;
  let fixture: ComponentFixture<UiSimpleMasonryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiSimpleMasonryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSimpleMasonryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
