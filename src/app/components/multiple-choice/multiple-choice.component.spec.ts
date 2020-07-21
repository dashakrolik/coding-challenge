import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceComponent } from './multiple-choice.component';
import { MultipleChoiceService } from '@services/multipleChoice/multiple-choice.service';
import { of } from 'rxjs';

const mockMultipleChoice: IMultipleChoiceQuestion = 
{ 
  id: 1, 
  languageId: 1, 
  questionNumber: 1, 
  question: "question", 
  questionCode: "questionCode", 
  multipleChoiceAnswerOptions: ["answer1", "answer2", "answer3", "answer4"] 
};

describe('MultipleChoiceComponent', () => {
  let component: MultipleChoiceComponent;
  let fixture: ComponentFixture<MultipleChoiceComponent>;
  let MultipleChoiceServiceSpy;

  beforeEach(async(() => {
    MultipleChoiceServiceSpy = jasmine.createSpyObj('MultipleChoiceService', ['getQuestion'], ["question1"]);
    MultipleChoiceServiceSpy.getQuestion.and.returnValue(of([mockMultipleChoice]));
    TestBed.configureTestingModule({
      declarations: [ MultipleChoiceComponent ],
      providers: [{
        provide: MultipleChoiceService,
        useValue: MultipleChoiceServiceSpy
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TODO: Fix the tests and remove the comments.
  // it('should create', () => {
  //   expect(MultipleChoiceServiceSpy.getQuestion).toHaveBeenCalledTimes(1);
  // });
});
