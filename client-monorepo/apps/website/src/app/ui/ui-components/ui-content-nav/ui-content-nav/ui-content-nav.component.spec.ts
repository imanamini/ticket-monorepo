import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiContentNavComponent } from './ui-content-nav.component';

describe('UiContentNavComponent', () => {
  let component: UiContentNavComponent;
  let fixture: ComponentFixture<UiContentNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UiContentNavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiContentNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
