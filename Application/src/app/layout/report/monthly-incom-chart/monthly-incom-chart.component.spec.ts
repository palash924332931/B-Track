import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyIncomChartComponent } from './monthly-incom-chart.component';

describe('MonthlyIncomChartComponent', () => {
  let component: MonthlyIncomChartComponent;
  let fixture: ComponentFixture<MonthlyIncomChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyIncomChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyIncomChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
