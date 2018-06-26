import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipBookComponent } from './payslip-book.component';

describe('PayslipBookComponent', () => {
  let component: PayslipBookComponent;
  let fixture: ComponentFixture<PayslipBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayslipBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
