import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendSmsLinkComponent } from './send-sms-link.component';

describe('SendSmsLinkComponent', () => {
  let component: SendSmsLinkComponent;
  let fixture: ComponentFixture<SendSmsLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendSmsLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendSmsLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
