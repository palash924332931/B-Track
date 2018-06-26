import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialActivityComponent } from './special-activity.component';

describe('SpecialActivityComponent', () => {
  let component: SpecialActivityComponent;
  let fixture: ComponentFixture<SpecialActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
