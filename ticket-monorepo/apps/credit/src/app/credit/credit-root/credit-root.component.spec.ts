import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRootComponent } from './credit-root.component';

describe('CreditRootComponent', () => {
  let component: CreditRootComponent;
  let fixture: ComponentFixture<CreditRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
