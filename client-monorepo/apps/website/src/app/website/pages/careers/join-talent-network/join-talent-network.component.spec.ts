import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinTalentNetworkComponent } from './join-talent-network.component';

describe('JoinTalentNetworkComponent', () => {
  let component: JoinTalentNetworkComponent;
  let fixture: ComponentFixture<JoinTalentNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinTalentNetworkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JoinTalentNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
