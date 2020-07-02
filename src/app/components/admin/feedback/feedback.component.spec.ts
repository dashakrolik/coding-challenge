import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComponent } from './feedback.component';
import { FeedbackService } from '@services/feedback/feedback.service';
import { of } from 'rxjs';

const mockFeedback: IFeedback = { email: "", feedback: "", id: 1 };

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let FeedbackServiceSpy;

  beforeEach(async(() => {
    FeedbackServiceSpy = jasmine.createSpyObj('FeedbackService', ['getFeedback']);
    FeedbackServiceSpy.getFeedback.and.returnValue(of([mockFeedback]));
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent],
      providers: [{
        provide: FeedbackService,
        useValue: FeedbackServiceSpy
      }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('retrieves the feedback on init', () => {
    expect(FeedbackServiceSpy.getFeedback).toHaveBeenCalledTimes(1);
  })
});
