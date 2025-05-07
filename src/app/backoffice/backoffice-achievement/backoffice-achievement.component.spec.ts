import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementComponent } from './backoffice-achievement.component';

describe('AchievementComponent', () => {
  let component: AchievementComponent;
  let fixture: ComponentFixture<AchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
