import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiExpireDateComponent } from './ui-expire-date.component';

describe('UiCardExpireDateComponent', () => {
  let component: UiExpireDateComponent;
  let fixture: ComponentFixture<UiExpireDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiExpireDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiExpireDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
