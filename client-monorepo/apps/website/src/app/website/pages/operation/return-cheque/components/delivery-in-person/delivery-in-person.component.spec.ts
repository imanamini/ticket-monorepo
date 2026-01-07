import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInPersonComponent } from './delivery-in-person.component';

describe('DeliveryInPersonComponent', () => {
  let component: DeliveryInPersonComponent;
  let fixture: ComponentFixture<DeliveryInPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryInPersonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryInPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
