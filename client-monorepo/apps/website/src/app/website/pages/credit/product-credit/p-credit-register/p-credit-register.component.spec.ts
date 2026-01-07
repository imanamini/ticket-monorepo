import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PCreditRegisterComponent } from './p-credit-register.component';

describe('PCreditRegisterComponent', () => {
  let component: PCreditRegisterComponent;
  let fixture: ComponentFixture<PCreditRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PCreditRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PCreditRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
