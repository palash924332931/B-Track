import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripSheetComponent } from './trip-sheet.component';

describe('TripSheetComponent', () => {
  let component: TripSheetComponent;
  let fixture: ComponentFixture<TripSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TripSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
