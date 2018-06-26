import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlybuswiseRepotComponent } from './monthlybuswise-repot.component';

describe('MonthlybuswiseRepotComponent', () => {
  let component: MonthlybuswiseRepotComponent;
  let fixture: ComponentFixture<MonthlybuswiseRepotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlybuswiseRepotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlybuswiseRepotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
