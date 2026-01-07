import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryByCourierComponent } from './delivery-by-courier.component';

describe('DeliveryByCourierComponent', () => {
  let component: DeliveryByCourierComponent;
  let fixture: ComponentFixture<DeliveryByCourierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryByCourierComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryByCourierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
