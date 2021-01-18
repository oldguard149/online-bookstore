import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[centerTitle]'
})
export class CenterTitleDirective {

  constructor() { }
  @HostBinding('style.width') get style() {
    return 'max-content';
  }

  @HostBinding('style.margin') get marin() {
    return '1rem auto';
  }
}
