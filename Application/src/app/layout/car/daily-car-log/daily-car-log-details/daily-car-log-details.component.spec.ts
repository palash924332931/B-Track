import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCarLogDetailsComponent } from './daily-car-log-details.component';

describe('DailyCarLogDetailsComponent', () => {
  let component: DailyCarLogDetailsComponent;
  let fixture: ComponentFixture<DailyCarLogDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyCarLogDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyCarLogDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
