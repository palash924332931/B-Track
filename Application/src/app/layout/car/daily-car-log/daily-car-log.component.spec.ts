import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCarLogComponent } from './daily-car-log.component';

describe('DailyCarLogComponent', () => {
  let component: DailyCarLogComponent;
  let fixture: ComponentFixture<DailyCarLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyCarLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyCarLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
