import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMultipleChoiceComponent } from './admin-multiple-choice.component';

describe('AdminMultipleChoiceComponent', () => {
  let component: AdminMultipleChoiceComponent;
  let fixture: ComponentFixture<AdminMultipleChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMultipleChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
