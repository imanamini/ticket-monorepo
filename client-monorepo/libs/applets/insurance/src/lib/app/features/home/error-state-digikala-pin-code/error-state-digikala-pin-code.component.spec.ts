import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorStateDigikalaPinCodeComponent } from './error-state-digikala-pin-code.component';

describe('ErrorStateDigikalaPinCodeComponent', () => {
  let component: ErrorStateDigikalaPinCodeComponent;
  let fixture: ComponentFixture<ErrorStateDigikalaPinCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateDigikalaPinCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorStateDigikalaPinCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
