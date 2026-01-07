import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplLayoutComponent } from './bnpl-layout.component';

describe('BnplLayoutComponent', () => {
  let component: BnplLayoutComponent;
  let fixture: ComponentFixture<BnplLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BnplLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
