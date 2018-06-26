import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayslipBookDetailsComponent } from './payslip-book-details.component';

describe('PayslipBookDetailsComponent', () => {
  let component: PayslipBookDetailsComponent;
  let fixture: ComponentFixture<PayslipBookDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayslipBookDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayslipBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
