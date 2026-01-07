import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmountBoxComponent } from './amount-box.component';

describe('AmountBoxComponent', () => {
  let component: AmountBoxComponent;
  let fixture: ComponentFixture<AmountBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmountBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
