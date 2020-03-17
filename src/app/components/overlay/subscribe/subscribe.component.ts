import { Component, OnInit } from '@angular/core';
import { MyOverlayRef } from 'src/app/service/overlay/myoverlay-ref';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  frmSubscribe = this.fb.group({
    firstName: 'Sander',
    lastName: 'Kools',
    email: [
      'Sander.Kools@Ordina.nl',
      Validators.compose([Validators.email, Validators.required])
    ]
  });

  constructor(private fb: FormBuilder, private ref: MyOverlayRef) {}

  ngOnInit() {}

  submit() {
    this.ref.close(this.frmSubscribe.value);
  }

  cancel() {
    this.ref.close(null);
  }
}
