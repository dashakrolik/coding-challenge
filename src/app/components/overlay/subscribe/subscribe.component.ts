import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClientService } from '@services/http/http-client.service';
import { TokenStorageService } from '@services/token/token-storage.service';
import { MyOverlayRef } from 'src/app/service/overlay/myoverlay-ref';
import { LoginService } from '@services/login/login.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  frmSubscribe = this.fb.group({
    firstName: '',
    lastName: '',
    email: [
      '',
      Validators.compose([Validators.email, Validators.required])
    ],
    password: ''
  });

  frmLogin = this.fb.group({
    email: [
      '',
      Validators.compose([Validators.email, Validators.required])
    ],
    password: ''
  });

  // @TODO use Material Design Dialogue instead
  constructor(
    private fb: FormBuilder,
    private ref: MyOverlayRef,
    private loginService: LoginService,
    private tokenStorageService: TokenStorageService
  ) {
  }

  ngOnInit() {
  }

  submitRegister() {
    console.log('submit register');
    console.log(this.frmSubscribe.value);

    const { firstName, lastName, email, password } = this.frmSubscribe.value;

    this.loginService.getRegister(firstName, lastName, email, password).subscribe(
      response => this.handleSuccessfulResponseGetRegister(response, email, password),
      err => {
        // TODO: show error message on screen
        console.log(err.error.message);
      }
    );

    this.ref.close(this.frmSubscribe.value);
  }

  handleSuccessfulResponseGetRegister = (response: any, email: string, password: string): void => {
    // The user successfully registered. We will log him in.
    this.loginService.getLogin(email, password).subscribe(
      registerResponse => this.handleSuccessfulResponseGetLogin(response),
      err => {
        // TODO: show error message on screen
        console.log(err.error.message);
      }
    );
  }

  submitLogin() {
    console.log('submit login');
    console.log(this.frmLogin.value);

    const { email, password } = this.frmLogin.value;
    this.loginService.getLogin(email, password).subscribe(
      response => this.handleSuccessfulResponseGetLogin(response),
      err => {
        // TODO: show error message on screen
        console.log(err.error.message);
      }
    );

    this.ref.close(this.frmSubscribe.value);
  }

  handleSuccessfulResponseGetLogin = (response): void => {
    this.tokenStorageService.saveToken(response.token);
    this.tokenStorageService.saveUser(response);

    window.location.reload();
  }

  openTab(tabName) {
    console.log('opening new tab ' + tabName);
    // We get both tab elements and we turn them off. Then we immediately turn the tab on that the user clicked on.
    const signIn = document.getElementById('Sign-in');
    const signUp = document.getElementById('Sign-up');
    signIn.style.display = 'none';
    signUp.style.display = 'none';

    const signInTab = document.getElementById('tab-sign-in');
    const signUpTab = document.getElementById('tab-sign-up');
    signInTab.className = 'tab';
    signUpTab.className = 'tab';

    if (tabName === 'Sign-in') {
      signIn.style.display = 'block';
      signInTab.className = 'tab is-active';
    } else if (tabName === 'Sign-up') {
      signUp.style.display = 'block';
      signUpTab.className = 'tab is-active';
    }
  }

  cancel = () => this.ref.close(null);
}
