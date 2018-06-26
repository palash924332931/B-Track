import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailypaymentReportComponent } from './dailypayment-report.component';

describe('DailypaymentReportComponent', () => {
  let component: DailypaymentReportComponent;
  let fixture: ComponentFixture<DailypaymentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailypaymentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailypaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
