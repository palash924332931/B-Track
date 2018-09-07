import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyIncomeExpenseReportComponent } from './monthly-income-expense-report.component';

describe('MonthlyIncomeExpenseReportComponent', () => {
  let component: MonthlyIncomeExpenseReportComponent;
  let fixture: ComponentFixture<MonthlyIncomeExpenseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyIncomeExpenseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyIncomeExpenseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
