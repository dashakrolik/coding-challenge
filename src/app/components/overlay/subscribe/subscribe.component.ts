import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MyOverlayRef } from 'src/app/service/overlay/myoverlay-ref';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent implements OnInit {
  form: FormGroup;

  // TODO use Material Design Dialogue instead
  constructor(private fb: FormBuilder, private overlayRef: MyOverlayRef) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: 'Sander',
      lastName: 'Kools',
      email: [
        'Sander.Kools@Ordina.nl',
        Validators.compose([Validators.email, Validators.required])
      ]
    });
  }

  submit = () => this.overlayRef.close(this.form.value);

  cancel = () => this.overlayRef.close(null);
}
