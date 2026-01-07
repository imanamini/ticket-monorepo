import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewShowIssuedPolicyComponent } from './preview-show-issued-policy.component';

describe('PreviewShowIssuedPolicyComponent', () => {
  let component: PreviewShowIssuedPolicyComponent;
  let fixture: ComponentFixture<PreviewShowIssuedPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewShowIssuedPolicyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewShowIssuedPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
