import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginService } from '@services/login/login.service';
import { MyOverlayRef } from '@services/overlay/myoverlay-ref';
import { TokenStorageService } from '@services/token/token-storage.service';
import { DialogService } from '@services/dialog/dialog.service';
import { OverlayService } from '@services/overlay/overlay.service';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent {
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

  constructor(
    private fb: FormBuilder,
    private ref: MyOverlayRef,
    private loginService: LoginService,
    private tokenStorageService: TokenStorageService,
    private dialogService: DialogService,
  ) {
  }

  submitRegistration() {
    const { firstName, lastName, email, password } = this.frmSubscribe.value;

    this.loginService.getRegister(firstName, lastName, email, password).subscribe(
      response => {
        this.handleSuccessfulResponseGetRegister(response, email, password),
          this.ref.close(this.frmSubscribe.value);
      },
      err => {
        // TODO: show error message on screen
        const message = {
          title: 'Error in the registration!',
          messages: this.setMessage(err.error)
        };
        this.dialogService.openMessage(message);
      }
    );

  }

  handleSuccessfulResponseGetRegister = (response: any, email: string, password: string): void => {
    // The user successfully registered. We will log him in.
    this.loginService.getLogin(email, password).subscribe(
      this.handleSuccessfulResponseGetLogin, err => {
        // TODO: show error message on screen
        const message = {
          title: 'Error while logging in.',
          messages: this.setMessage(err.error),
        };
        this.dialogService.openMessage(message);
      }
    );
  }

  submitLogin() {
    const { email, password } = this.frmLogin.value;
    this.loginService.getLogin(email, password).subscribe(
      response => {
        this.handleSuccessfulResponseGetLogin(response);
        this.ref.close(this.frmSubscribe.value);
      },
      err => {
        const dialogMessage = {
          title: 'Error while logging in.',
          messages: this.setMessage(err.error),
        };
        this.dialogService.openMessage(dialogMessage);
      }
    );

  }

  handleSuccessfulResponseGetLogin = (response): void => {
    this.tokenStorageService.saveToken(response.token);
    this.tokenStorageService.saveUser(response);
  }

  // USE TSLINT GUIDELINES!!
  openTab(tabName) {
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

  setMessage = (error: any): string[] => {
    if (error.status === 401) { return ['Invalid username and password combination.']; }
    const messages: string[] = [];
    for (const violation of error.violations) {
      messages.push(violation.message);
    }
    return messages;
  }
}
