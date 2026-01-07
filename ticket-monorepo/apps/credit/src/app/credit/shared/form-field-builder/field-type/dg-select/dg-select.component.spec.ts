import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DgSelectComponent } from './dg-select.component';

describe('HesSelectComponent', () => {
  let component: DgSelectComponent;
  let fixture: ComponentFixture<DgSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DgSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DgSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
