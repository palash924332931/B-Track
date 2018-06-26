import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCostComponent } from './root-cost.component';

describe('RootCostComponent', () => {
  let component: RootCostComponent;
  let fixture: ComponentFixture<RootCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
