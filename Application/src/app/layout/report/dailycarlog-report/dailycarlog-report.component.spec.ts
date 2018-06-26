import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailycarlogReportComponent } from './dailycarlog-report.component';

describe('DailycarlogReportComponent', () => {
  let component: DailycarlogReportComponent;
  let fixture: ComponentFixture<DailycarlogReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailycarlogReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailycarlogReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
