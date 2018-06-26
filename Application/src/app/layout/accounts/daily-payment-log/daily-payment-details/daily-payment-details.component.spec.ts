import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPaymentDetailsComponent } from './daily-payment-details.component';

describe('DailyPaymentDetailsComponent', () => {
  let component: DailyPaymentDetailsComponent;
  let fixture: ComponentFixture<DailyPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
