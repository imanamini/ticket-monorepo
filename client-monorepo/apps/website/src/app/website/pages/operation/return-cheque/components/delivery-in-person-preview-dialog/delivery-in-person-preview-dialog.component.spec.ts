import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInPersonPreviewDialogComponent } from './delivery-in-person-preview-dialog.component';

describe('DeliveryInPersonPreviewDialogComponent', () => {
  let component: DeliveryInPersonPreviewDialogComponent;
  let fixture: ComponentFixture<DeliveryInPersonPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryInPersonPreviewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryInPersonPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
