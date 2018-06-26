import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipManagerComponent } from './payslip-manager.component';

describe('PayslipManagerComponent', () => {
  let component: PayslipManagerComponent;
  let fixture: ComponentFixture<PayslipManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayslipManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
