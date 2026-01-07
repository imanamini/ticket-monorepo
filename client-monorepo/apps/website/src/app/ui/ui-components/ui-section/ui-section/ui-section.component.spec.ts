import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UiSectionComponent } from './ui-section.component';

describe('UiSectionComponent', () => {
  let component: UiSectionComponent;
  let fixture: ComponentFixture<UiSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UiSectionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
