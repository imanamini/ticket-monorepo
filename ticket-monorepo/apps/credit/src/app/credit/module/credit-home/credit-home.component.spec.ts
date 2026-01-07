import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditHomeComponent } from './credit-home.component';

describe('CreditHomeComponent', () => {
  let component: CreditHomeComponent;
  let fixture: ComponentFixture<CreditHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
