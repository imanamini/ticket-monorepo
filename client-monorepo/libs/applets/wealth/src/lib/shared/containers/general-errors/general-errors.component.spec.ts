import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralErrorsComponent } from './general-errors.component';

describe('GeneralErrorsComponent', () => {
  let component: GeneralErrorsComponent;
  let fixture: ComponentFixture<GeneralErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralErrorsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GeneralErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
