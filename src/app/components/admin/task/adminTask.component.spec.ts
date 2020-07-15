import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTaskComponent } from './adminTask.component';

xdescribe('AdminTaskComponent', () => {
  let component: AdminTaskComponent;
  let fixture: ComponentFixture<AdminTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTaskComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
