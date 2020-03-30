import { Component, OnInit } from '@angular/core';
import { MyOverlayRef } from 'src/app/service/overlay/myoverlay-ref';
import { FormBuilder, Validators } from '@angular/forms';
import {AuthenticationService} from "../../../service/authentication.service";

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
    private loginservice: AuthenticationService) {}

  ngOnInit() {}

  submitRegister() {
    console.log("submit register");
    console.log(this.frmSubscribe.value);

    if (this.loginservice.registerUser(this.frmSubscribe.value.firstName, this.frmSubscribe.value.lastName, this.frmLogin.value.email, this.frmLogin.value.password)) {
      console.log("success");
    } else {
      console.log("failed");
    }

    this.ref.close(this.frmSubscribe.value);
  }

  submitLogin() {
    console.log("submit login");
    console.log(this.frmLogin.value);

    if (this.loginservice.loginUser(this.frmLogin.value.email, this.frmLogin.value.password)) {
      console.log("success");
    } else {
      console.log("failed");
    }

    this.ref.close(this.frmLogin.value);
  }

  cancel() {
    this.ref.close(null);
  }

  openTab(tabName) {
    console.log("opening new tab " + tabName);
    // We get both tab elements and we turn them off. Them we immediately turn the tab on that the user clicked on.
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
