import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OBnplFormComponent } from './o-bnpl-form.component';

describe('OBnplFormComponent', () => {
  let component: OBnplFormComponent;
  let fixture: ComponentFixture<OBnplFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OBnplFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OBnplFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
