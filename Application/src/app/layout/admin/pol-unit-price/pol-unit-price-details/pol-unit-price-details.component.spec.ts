import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolUnitPriceDetailsComponent } from './pol-unit-price-details.component';

describe('PolUnitPriceDetailsComponent', () => {
  let component: PolUnitPriceDetailsComponent;
  let fixture: ComponentFixture<PolUnitPriceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolUnitPriceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolUnitPriceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
