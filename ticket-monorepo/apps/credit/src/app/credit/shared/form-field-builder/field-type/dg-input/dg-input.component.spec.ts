import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgInputComponent } from './dg-input.component';

describe('HesInputComponent', () => {
  let component: DgInputComponent;
  let fixture: ComponentFixture<DgInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
