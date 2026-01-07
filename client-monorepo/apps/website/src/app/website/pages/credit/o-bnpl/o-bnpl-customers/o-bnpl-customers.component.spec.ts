import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OBnplCustomersComponent } from './o-bnpl-customers.component';

describe('OBnplCustomersComponent', () => {
  let component: OBnplCustomersComponent;
  let fixture: ComponentFixture<OBnplCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OBnplCustomersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OBnplCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
