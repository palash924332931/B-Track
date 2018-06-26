import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipReportComponent } from './payslip-report.component';

describe('PayslipReportComponent', () => {
  let component: PayslipReportComponent;
  let fixture: ComponentFixture<PayslipReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayslipReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
