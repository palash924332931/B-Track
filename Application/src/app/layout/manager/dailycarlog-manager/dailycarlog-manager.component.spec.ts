import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailycarlogManagerComponent } from './dailycarlog-manager.component';

describe('DailycarlogManagerComponent', () => {
  let component: DailycarlogManagerComponent;
  let fixture: ComponentFixture<DailycarlogManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailycarlogManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailycarlogManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
