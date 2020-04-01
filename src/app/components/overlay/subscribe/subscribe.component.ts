import { Component, OnInit } from '@angular/core';
import { MyOverlayRef } from 'src/app/service/overlay/myoverlay-ref';
import { FormBuilder, Validators } from '@angular/forms';
import {HttpClientService} from "../../../service/http/http-client.service";
import {TokenStorageService} from "../../../service/token/token-storage.service";

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

  constructor(
    private fb: FormBuilder,
    private ref: MyOverlayRef,
    private httpClientService: HttpClientService,
    private tokenStorageService: TokenStorageService
  ) {
  }

  ngOnInit() {
  }

  submitRegister() {
    console.log("submit register");
    console.log(this.frmSubscribe.value);

    const { firstName, lastName, email, password } = this.frmSubscribe.value;

    this.httpClientService.getRegister(firstName, lastName, email, password).subscribe(
      response => this.handleSuccessfulResponseGetRegister(response, email, password),
      err => {
        // TODO: show error message on screen
          console.log(err.error.message);
        }
    );

    this.ref.close(this.frmSubscribe.value);
  }

  handleSuccessfulResponseGetRegister = (response, email, password): void => {
    // The user successfully registered. We will log him in.
    this.httpClientService.getLogin(email, password).subscribe(
      response => this.handleSuccessfulResponseGetLogin(response),
      err => {
        // TODO: show error message on screen
        console.log(err.error.message);
      }
    );
  };

  submitLogin() {
    console.log("submit login");
    console.log(this.frmLogin.value);

    const { email, password } = this.frmLogin.value;
    this.httpClientService.getLogin(email, password).subscribe(
      response => this.handleSuccessfulResponseGetLogin(response),
      err => {
        // TODO: show error message on screen
        console.log(err.error.message);
      }
    );

    this.ref.close(this.frmSubscribe.value);
  }

  handleSuccessfulResponseGetLogin = (response): void => {
    // The user successfully logged in. We will store the username in the session
    console.log("successful post message get login");
    console.log(response);
    sessionStorage.setItem('username', response.username);
    this.tokenStorageService.saveToken(response.accessToken);
    this.tokenStorageService.saveUser(response);

    window.location.reload();
  };

  cancel() {
    this.ref.close(null);
  }

  openTab(tabName) {
    console.log("opening new tab " + tabName);
    // We get both tab elements and we turn them off. Then we immediately turn the tab on that the user clicked on.
    let signIn = document.getElementById('Sign-in');
    let signUp = document.getElementById('Sign-up');
    signIn.style.display = "none";
    signUp.style.display = "none";

    let signInTab = document.getElementById("tab-sign-in");
    let signUpTab = document.getElementById("tab-sign-up");
    signInTab.className = "tab";
    signUpTab.className = "tab";

    if (tabName == "Sign-in") {
      signIn.style.display = "block";
      signInTab.className = "tab is-active";
    } else if (tabName == "Sign-up") {
      signUp.style.display = "block";
      signUpTab.className = "tab is-active";
    }
  }
}
