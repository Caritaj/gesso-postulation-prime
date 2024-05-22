import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[scrollToUp]',
})
export class ScrollToUpDirective {
  @HostListener('click')
  onClick() {
    window.scrollTo(0, 0);
  }
}
