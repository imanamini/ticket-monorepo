import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelAndGoBackComponent } from './cancel-and-go-back.component';

describe('CancelAndGoBackComponent', () => {
  let component: CancelAndGoBackComponent;
  let fixture: ComponentFixture<CancelAndGoBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelAndGoBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelAndGoBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
