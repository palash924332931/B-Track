import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootDetailsComponent } from './root-details.component';

describe('RootDetailsComponent', () => {
  let component: RootDetailsComponent;
  let fixture: ComponentFixture<RootDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
