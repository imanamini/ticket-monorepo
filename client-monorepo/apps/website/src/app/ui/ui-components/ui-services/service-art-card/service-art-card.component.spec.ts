import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceArtCardComponent } from './service-art-card.component';

describe('ServiceArtCardComponent', () => {
  let component: ServiceArtCardComponent;
  let fixture: ComponentFixture<ServiceArtCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceArtCardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceArtCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
