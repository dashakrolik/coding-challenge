import { TestBed } from '@angular/core/testing';
import { AuthGuard } from '@guards/auth/auth.guard';

xdescribe('AuthGuardService', () => {
  let service: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
