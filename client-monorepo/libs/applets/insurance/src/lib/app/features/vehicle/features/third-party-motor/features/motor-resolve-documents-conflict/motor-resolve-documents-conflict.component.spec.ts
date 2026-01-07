import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorResolveDocumentsConflictComponent } from './motor-resolve-documents-conflict.component';

describe('MotorResolveDocumentsConflictComponent', () => {
  let component: MotorResolveDocumentsConflictComponent;
  let fixture: ComponentFixture<MotorResolveDocumentsConflictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotorResolveDocumentsConflictComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MotorResolveDocumentsConflictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
