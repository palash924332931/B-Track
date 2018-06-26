import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyPaymentLogComponent } from './daily-payment-log.component';

describe('DailyPaymentLogComponent', () => {
  let component: DailyPaymentLogComponent;
  let fixture: ComponentFixture<DailyPaymentLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyPaymentLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyPaymentLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
