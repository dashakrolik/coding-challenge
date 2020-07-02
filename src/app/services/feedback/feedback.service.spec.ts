import { TestBed } from '@angular/core/testing';
import { FeedbackService } from './feedback.service';
import { HttpClient } from '@angular/common/http';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let HttpClientSpy;

  beforeEach(() => {
    HttpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({ providers: [FeedbackService, { provide: HttpClient, useValue: HttpClientSpy }] });
    service = TestBed.inject(FeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
