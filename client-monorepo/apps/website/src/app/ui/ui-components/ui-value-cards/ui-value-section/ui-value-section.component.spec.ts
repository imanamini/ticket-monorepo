import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiValueSectionComponent } from './ui-value-section.component';

describe('UiValueSectionComponent', () => {
  let component: UiValueSectionComponent;
  let fixture: ComponentFixture<UiValueSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiValueSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiValueSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
