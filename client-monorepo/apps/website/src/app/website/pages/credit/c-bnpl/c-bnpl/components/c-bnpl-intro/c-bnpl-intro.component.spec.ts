import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CBnplIntroComponent } from './c-bnpl-intro.component';

describe('CBnplIntroComponent', () => {
  let component: CBnplIntroComponent;
  let fixture: ComponentFixture<CBnplIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CBnplIntroComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CBnplIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
