import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFormMessageComponent } from './ui-form-message.component';

describe('UiFormMessageComponent', () => {
  let component: UiFormMessageComponent;
  let fixture: ComponentFixture<UiFormMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiFormMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiFormMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
