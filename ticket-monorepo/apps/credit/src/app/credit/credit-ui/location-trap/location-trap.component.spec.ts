import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTrapComponent } from './location-trap.component';

describe('LocationTrapComponent', () => {
  let component: LocationTrapComponent;
  let fixture: ComponentFixture<LocationTrapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationTrapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
