import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityEditComponent } from './activity-edit.component';

describe('ActivityEditComponent', () => {
  let component: ActivityEditComponent;
  let fixture: ComponentFixture<ActivityEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
