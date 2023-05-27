import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowOperatorComponent } from './follow-operator.component';

describe('FollowOperatorComponent', () => {
  let component: FollowOperatorComponent;
  let fixture: ComponentFixture<FollowOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowOperatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
