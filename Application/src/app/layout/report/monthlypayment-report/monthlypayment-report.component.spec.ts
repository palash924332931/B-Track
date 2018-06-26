import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlypaymentReportComponent } from './monthlypayment-report.component';

describe('MonthlypaymentReportComponent', () => {
  let component: MonthlypaymentReportComponent;
  let fixture: ComponentFixture<MonthlypaymentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlypaymentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlypaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
