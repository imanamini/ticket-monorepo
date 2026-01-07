import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryByCourierPreviewDialogComponent } from './delivery-by-courier-preview-dialog.component';

describe('DeliveryByCourierPreviewDialogComponent', () => {
  let component: DeliveryByCourierPreviewDialogComponent;
  let fixture: ComponentFixture<DeliveryByCourierPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryByCourierPreviewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryByCourierPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
