import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryByPostComponent } from './delivery-by-post.component';

describe('DeliveryByPostComponent', () => {
  let component: DeliveryByPostComponent;
  let fixture: ComponentFixture<DeliveryByPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryByPostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryByPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
