import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartsAllocationComponent } from './parts-allocation.component';

describe('PartsAllocationComponent', () => {
  let component: PartsAllocationComponent;
  let fixture: ComponentFixture<PartsAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartsAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartsAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
