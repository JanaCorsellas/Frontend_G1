import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementCreateComponent } from './achievement-create.component';

describe('AchievementCreateComponent', () => {
  let component: AchievementCreateComponent;
  let fixture: ComponentFixture<AchievementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
