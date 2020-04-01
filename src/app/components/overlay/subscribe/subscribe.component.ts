import { Component } from '@angular/core';
import { MyOverlayRef } from 'src/app/service/overlay/myoverlay-ref';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent {
  frmSubscribe = this.fb.group({
    firstName: 'Sander',
    lastName: 'Kools',
    email: [
      'Sander.Kools@Ordina.nl',
      Validators.compose([Validators.email, Validators.required])
    ]
  });

  // @TODO use Material Design Dialogue instead
  constructor(private fb: FormBuilder, private ref: MyOverlayRef) {}

  submit = () => this.ref.close(this.frmSubscribe.value);

  cancel = () => this.ref.close(null);
}
