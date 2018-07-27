import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherManagerComponent } from './voucher-manager.component';

describe('VoucherManagerComponent', () => {
  let component: VoucherManagerComponent;
  let fixture: ComponentFixture<VoucherManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
