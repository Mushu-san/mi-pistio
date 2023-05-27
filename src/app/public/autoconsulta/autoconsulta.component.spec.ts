import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoconsultaComponent } from './autoconsulta.component';

describe('AutoconsultaComponent', () => {
  let component: AutoconsultaComponent;
  let fixture: ComponentFixture<AutoconsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoconsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoconsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
