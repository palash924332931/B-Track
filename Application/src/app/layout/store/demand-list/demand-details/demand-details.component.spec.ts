import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandDetailsComponent } from './demand-details.component';

describe('DemandDetailsComponent', () => {
  let component: DemandDetailsComponent;
  let fixture: ComponentFixture<DemandDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
