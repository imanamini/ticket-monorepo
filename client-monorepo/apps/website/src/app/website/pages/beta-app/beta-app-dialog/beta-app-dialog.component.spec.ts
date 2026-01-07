import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaAppDialogComponent } from './beta-app-dialog.component';

describe('BetaAppDialogComponent', () => {
  let component: BetaAppDialogComponent;
  let fixture: ComponentFixture<BetaAppDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BetaAppDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BetaAppDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
