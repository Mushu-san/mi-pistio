import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowCentralizadorComponent } from './follow-centralizador.component';

describe('FollowCentralizadorComponent', () => {
  let component: FollowCentralizadorComponent;
  let fixture: ComponentFixture<FollowCentralizadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowCentralizadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowCentralizadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
