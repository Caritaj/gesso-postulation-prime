import { Directive, ElementRef, HostListener } from '@angular/core';


@Directive({
    selector: '[onlyNumbers]'
})
export class OnlyNumbersDirective {
    private pattern = /^[0 - 9]*$/;

    constructor(private el: ElementRef) {
    }

    @HostListener('keypress', ['$event']) onKeyPress(event: { key: string; }): boolean {
        return new RegExp(this.pattern).test(event.key);
    }

    @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent): void {
        setTimeout(() => {
            this.el.nativeElement.value = this.filterNumbers(this.el.nativeElement.value);
        }, 1);
    }

    filterNumbers(value: string) {
        if (value && typeof value === 'string') {
            const arr: string[] = [];
            value.split('').forEach(n => {
                if (this.pattern.test(n)) {
                    arr.push(n);
                }
            });
            return arr.join('');
        } else {
            return value;
        }
    }
}