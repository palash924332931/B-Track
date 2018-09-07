import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolUnitPriceComponent } from './pol-unit-price.component';

describe('PolUnitPriceComponent', () => {
  let component: PolUnitPriceComponent;
  let fixture: ComponentFixture<PolUnitPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolUnitPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolUnitPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
