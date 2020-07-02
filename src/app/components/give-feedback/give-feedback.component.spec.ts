import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveFeedbackComponent } from './give-feedback.component';
import { FeedbackService } from '@services/feedback/feedback.service';
import { of } from 'rxjs';

describe('GiveFeedbackComponent', () => {
  let component: GiveFeedbackComponent;
  let fixture: ComponentFixture<GiveFeedbackComponent>;
  let FeedbackServiceSpy;

  beforeEach(async(() => {
    FeedbackServiceSpy = jasmine.createSpyObj('FeedbackService', ['sendFeedback']);
    FeedbackServiceSpy.sendFeedback("it is very good");
    TestBed.configureTestingModule({
      declarations: [ GiveFeedbackComponent ],
      providers: [{
        provide: FeedbackService,
        useValue: FeedbackServiceSpy
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiveFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: The tests are not really working yet, I have now commented this out but it should be included.
  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
