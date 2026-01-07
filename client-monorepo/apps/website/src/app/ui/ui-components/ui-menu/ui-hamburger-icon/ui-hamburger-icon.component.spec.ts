import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiHamburgerIconComponent } from './ui-hamburger-icon.component';

describe('UiHamburgerIconComponent', () => {
  let component: UiHamburgerIconComponent;
  let fixture: ComponentFixture<UiHamburgerIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiHamburgerIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiHamburgerIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
