import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input('person') person: IPerson;
  getMailLink = () => {
    const url = 'mailto:' + this.person.username + '?subject=Hello from the coding challenge.';
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  constructor(private sanitizer: DomSanitizer) { }
}
