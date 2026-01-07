import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BnplUsageTutorialComponent } from './bnpl-usage-tutorial.component';

describe('BnplUsageTutorialComponent', () => {
  let component: BnplUsageTutorialComponent;
  let fixture: ComponentFixture<BnplUsageTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BnplUsageTutorialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BnplUsageTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
