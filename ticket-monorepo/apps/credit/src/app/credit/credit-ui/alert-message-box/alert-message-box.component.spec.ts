import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertMessageBoxComponent } from './alert-message-box.component';

describe('AlertMessageBoxComponent', () => {
  let component: AlertMessageBoxComponent;
  let fixture: ComponentFixture<AlertMessageBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertMessageBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
