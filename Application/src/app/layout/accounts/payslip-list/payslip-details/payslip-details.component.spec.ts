import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipDetailsComponent } from './payslip-details.component';

describe('PayslipDetailsComponent', () => {
  let component: PayslipDetailsComponent;
  let fixture: ComponentFixture<PayslipDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayslipDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
