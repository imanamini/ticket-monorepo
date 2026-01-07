import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiContactSectionComponent } from './ui-contact-section.component';

describe('UiContactSectionComponent', () => {
  let component: UiContactSectionComponent;
  let fixture: ComponentFixture<UiContactSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiContactSectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiContactSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
