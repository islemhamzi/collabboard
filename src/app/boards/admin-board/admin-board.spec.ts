import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBoard } from './admin-board';

describe('AdminBoard', () => {
  let component: AdminBoard;
  let fixture: ComponentFixture<AdminBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBoard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
