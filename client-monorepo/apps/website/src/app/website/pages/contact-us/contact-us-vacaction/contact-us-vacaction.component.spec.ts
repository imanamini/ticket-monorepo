import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsVacactionComponent } from './contact-us-vacaction.component';

describe('ContactUsVacactionComponent', () => {
  let component: ContactUsVacactionComponent;
  let fixture: ComponentFixture<ContactUsVacactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactUsVacactionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsVacactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
