import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolDetailsComponent } from './pol-details.component';

describe('PolDetailsComponent', () => {
  let component: PolDetailsComponent;
  let fixture: ComponentFixture<PolDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
