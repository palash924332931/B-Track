import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCostDetailsComponent } from './root-cost-details.component';

describe('RootCostDetailsComponent', () => {
  let component: RootCostDetailsComponent;
  let fixture: ComponentFixture<RootCostDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootCostDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
