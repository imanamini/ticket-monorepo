import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftInformationComponent } from './gift-information.component';

describe('GiftInformationComponent', () => {
  let component: GiftInformationComponent;
  let fixture: ComponentFixture<GiftInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiftInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
