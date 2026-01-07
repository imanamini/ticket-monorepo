import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryByPostPreviewDialogComponent } from './delivery-by-post-preview-dialog.component';

describe('DeliveryByPostPreviewDialogComponent', () => {
  let component: DeliveryByPostPreviewDialogComponent;
  let fixture: ComponentFixture<DeliveryByPostPreviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryByPostPreviewDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeliveryByPostPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
