import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCreditTypeComponent } from './p-credit-type.component';

describe('PCreditTypeComponent', () => {
  let component: PCreditTypeComponent;
  let fixture: ComponentFixture<PCreditTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PCreditTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PCreditTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
