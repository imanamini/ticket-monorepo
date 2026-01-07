import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiLoadingDotsComponent } from './ui-loading-dots.component';

describe('UiLoadingDotsComponent', () => {
  let component: UiLoadingDotsComponent;
  let fixture: ComponentFixture<UiLoadingDotsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiLoadingDotsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiLoadingDotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
