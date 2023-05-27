import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterUrlComponent } from './router-url.component';

describe('RouterUrlComponent', () => {
  let component: RouterUrlComponent;
  let fixture: ComponentFixture<RouterUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouterUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
