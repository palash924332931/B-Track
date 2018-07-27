import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolManagerComponent } from './pol-manager.component';

describe('PolManagerComponent', () => {
  let component: PolManagerComponent;
  let fixture: ComponentFixture<PolManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
