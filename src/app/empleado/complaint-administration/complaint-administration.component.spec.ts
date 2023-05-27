import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintAdministrationComponent } from './complaint-administration.component';

describe('ComplaintAdministrationComponent', () => {
  let component: ComplaintAdministrationComponent;
  let fixture: ComponentFixture<ComplaintAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplaintAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
