// Diretiva para máscara de CPF (000.000.000-00) em tempo real.
// - Atualiza o valor do FormControl sem emitir evento (evita loops).
// - Não valida dígitos verificadores, apenas o formato.

import { Directive, ElementRef, HostListener, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[cpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>, @Optional() private ngControl: NgControl) {}

  @HostListener('input')
  onInput(): void {
    const input = this.el.nativeElement;
    let v = input.value.replace(/\D/g, '').slice(0, 11);

    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3}).*/, '$1.$2');

    input.value = v;
    this.ngControl?.control?.setValue(v, { emitEvent: false });
  }

  // Mantido para evoluções futuras (ex.: limpar valor inválido no blur)
  @HostListener('blur')
  onBlur(): void {}
}
