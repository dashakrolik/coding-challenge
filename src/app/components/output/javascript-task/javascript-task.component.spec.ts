import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JavascriptTaskComponent } from './javascript-task.component';

describe('JavascriptTaskComponent', () => {
  let component: JavascriptTaskComponent;
  let fixture: ComponentFixture<JavascriptTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JavascriptTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JavascriptTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
