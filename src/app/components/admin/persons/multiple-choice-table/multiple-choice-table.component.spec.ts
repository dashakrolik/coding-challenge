import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceTableComponent } from './multiple-choice-table.component';

describe('MultipleChoiceTableComponent', () => {
  let component: MultipleChoiceTableComponent;
  let fixture: ComponentFixture<MultipleChoiceTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleChoiceTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
