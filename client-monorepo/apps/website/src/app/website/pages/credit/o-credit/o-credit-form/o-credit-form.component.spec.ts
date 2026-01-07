import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OCreditFormComponent } from './o-credit-form.component';

describe('OCreditFormComponent', () => {
  let component: OCreditFormComponent;
  let fixture: ComponentFixture<OCreditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OCreditFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OCreditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
