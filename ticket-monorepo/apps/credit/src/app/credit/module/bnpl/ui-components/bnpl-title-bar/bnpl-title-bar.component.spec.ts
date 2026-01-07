import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplTitleBarComponent } from './bnpl-title-bar.component';

describe('BnplTitleBarComponent', () => {
  let component: BnplTitleBarComponent;
  let fixture: ComponentFixture<BnplTitleBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BnplTitleBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BnplTitleBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
