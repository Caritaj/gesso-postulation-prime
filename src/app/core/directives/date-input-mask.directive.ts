import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appInputMask]'
})
export class DateInputMaskDirective {
    private defaultMask: string = '00/00/0000';

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event'])
    onInput(event: InputEvent) {
        const input = event.target as HTMLInputElement;
        let originalValue = input.value.replace(/\D/g, '');
        let maskedValue = '';
        let valueIndex = 0;

        // Validate and adjust day and month values
        if (originalValue.length >= 2) {
            let day = parseInt(originalValue.substring(0, 2));
            if (day > 31) {
                day = 31;
            }
            originalValue = day.toString().padStart(2, '0') + originalValue.substring(2);
        }

        if (originalValue.length >= 4) {
            let month = parseInt(originalValue.substring(2, 4));
            if (month > 12) {
                month = 12;
            }
            originalValue = originalValue.substring(0, 2) + month.toString().padStart(2, '0') + originalValue.substring(4);
        }

        // Apply mask using for-of loop
        for (const maskChar of this.defaultMask) {
            if (/\d/.test(maskChar)) {
                if (originalValue[valueIndex]) {
                    maskedValue += originalValue[valueIndex++];
                } else {
                    break;
                }
            } else {
                maskedValue += maskChar;
            }
        }

        const cursorPosition = this.el.nativeElement.selectionStart;
        input.value = maskedValue;

        // Restore the cursor position
        const newCursorPosition = cursorPosition + (maskedValue.length - originalValue.length);
        this.el.nativeElement.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        const controlKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'];
        if (controlKeys.includes(event.key)) {
            return;
        }

        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    }

    @HostListener('dblclick', ['$event'])
    onDoubleClick(event: MouseEvent) {
        const input = event.target as HTMLInputElement;
        input.select(); 
    }
}
