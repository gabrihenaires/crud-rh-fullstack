// Diretiva de máscara telefônica brasileira dinâmica.
// - Aceita entrada com/sem DDI 55 (corta 55 quando ultrapassa 11 dígitos).
// - Formata como "(11) 99999-9999" conforme digitação.

import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[phoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>, @Optional() private ngControl: NgControl) {}

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;

    let d = input.value.replace(/\D/g, '');
    if (d.startsWith('55') && d.length > 11) d = d.slice(2);
    d = d.slice(0, 11);

    let v = d;
    if (d.length > 6) v = d.replace(/(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    else if (d.length > 2) v = d.replace(/(\d{2})(\d{0,4}).*/, '($1) $2');
    else if (d.length > 0) v = d.replace(/(\d{0,2}).*/, '($1');

    input.value = v.trim();
    this.ngControl?.control?.setValue(input.value, { emitEvent: false });
  }
}
